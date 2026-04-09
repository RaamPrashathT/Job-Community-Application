"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function recruitApplicants(jobId: string, applicantIds: string[]) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user owns the organization that posted this job
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
      include: {
        organization: true,
      },
    });

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    if (job.organization.creatorId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if trying to recruit more than available openings
    const currentRecruits = await prisma.jobApplication.count({
      where: {
        jobPostId: jobId,
        status: "RECRUITED",
      },
    });

    if (currentRecruits + applicantIds.length > job.openings) {
      return { 
        success: false, 
        error: `Cannot recruit ${applicantIds.length} applicants. Only ${job.openings - currentRecruits} positions remaining.` 
      };
    }

    // Update application status to RECRUITED
    await prisma.jobApplication.updateMany({
      where: {
        id: { in: applicantIds },
        jobPostId: jobId,
      },
      data: {
        status: "RECRUITED",
      },
    });

    // Get applicant details for sending emails
    const applications = await prisma.jobApplication.findMany({
      where: {
        id: { in: applicantIds },
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });

    // Send recruitment emails
    const emailPromises = applications.map((application) =>
      resend.emails.send({
        from: "NightShift Jobs <onboarding@resend.dev>",
        to: application.user.email,
        subject: `Congratulations! You've been recruited for ${job.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7EE8A2;">Congratulations, ${application.user.username}!</h1>
            <p style="font-size: 16px; color: #333;">
              We're excited to inform you that you've been selected for the position of 
              <strong>${job.title}</strong> at <strong>${job.organization.name}</strong>.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Position Details:</h2>
              <p><strong>Role:</strong> ${job.title}</p>
              <p><strong>Company:</strong> ${job.organization.name}</p>
              <p><strong>Location:</strong> ${job.location}</p>
              <p><strong>Type:</strong> ${job.type}</p>
            </div>
            <p style="font-size: 16px; color: #333;">
              The hiring team will reach out to you shortly with next steps.
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Best regards,<br/>
              The ${job.organization.name} Team
            </p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);

    return { 
      success: true, 
      message: `Successfully recruited ${applicantIds.length} ${applicantIds.length === 1 ? "applicant" : "applicants"}` 
    };
  } catch (error) {
    console.error("Recruit applicants error:", error);
    return { success: false, error: "Failed to recruit applicants" };
  }
}
