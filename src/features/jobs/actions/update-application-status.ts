"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function updateApplicationStatus(
  applicationId: string,
  status: "RECRUITED" | "REJECTED"
) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Get application with job and organization details
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        jobPost: {
          include: {
            organization: true,
          },
        },
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    // Verify user owns the organization
    if (application.jobPost.organization.creatorId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    // If recruiting, check if there are available openings
    if (status === "RECRUITED") {
      const currentRecruits = await prisma.jobApplication.count({
        where: {
          jobPostId: application.jobPostId,
          status: "RECRUITED",
        },
      });

      if (currentRecruits >= application.jobPost.openings) {
        return {
          success: false,
          error: "All positions have been filled",
        };
      }
    }

    // Update application status
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    // Send email notification
    const emailSubject =
      status === "RECRUITED"
        ? `Congratulations! You've been recruited for ${application.jobPost.title}`
        : `Update on your application for ${application.jobPost.title}`;

    const emailHtml =
      status === "RECRUITED"
        ? `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7EE8A2;">Congratulations, ${application.user.username}!</h1>
            <p style="font-size: 16px; color: #333;">
              We're excited to inform you that you've been selected for the position of 
              <strong>${application.jobPost.title}</strong> at <strong>${application.jobPost.organization.name}</strong>.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Position Details:</h2>
              <p><strong>Role:</strong> ${application.jobPost.title}</p>
              <p><strong>Company:</strong> ${application.jobPost.organization.name}</p>
              <p><strong>Location:</strong> ${application.jobPost.location}</p>
              <p><strong>Type:</strong> ${application.jobPost.type}</p>
            </div>
            <p style="font-size: 16px; color: #333;">
              The hiring team will reach out to you shortly with next steps.
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Best regards,<br/>
              The ${application.jobPost.organization.name} Team
            </p>
          </div>
        `
        : `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Application Update</h1>
            <p style="font-size: 16px; color: #333;">
              Dear ${application.user.username},
            </p>
            <p style="font-size: 16px; color: #333;">
              Thank you for your interest in the <strong>${application.jobPost.title}</strong> position at 
              <strong>${application.jobPost.organization.name}</strong>.
            </p>
            <p style="font-size: 16px; color: #333;">
              After careful consideration, we have decided to move forward with other candidates whose 
              qualifications more closely match our current needs.
            </p>
            <p style="font-size: 16px; color: #333;">
              We appreciate the time you invested in the application process and encourage you to 
              apply for future opportunities that match your skills and experience.
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Best regards,<br/>
              The ${application.jobPost.organization.name} Team
            </p>
          </div>
        `;

    await resend.emails.send({
      from: "NightShift Jobs <onboarding@resend.dev>",
      to: application.user.email,
      subject: emailSubject,
      html: emailHtml,
    });

    revalidatePath(`/jobs/${application.jobPostId}/applicants`);

    return {
      success: true,
      message:
        status === "RECRUITED"
          ? "Applicant recruited successfully"
          : "Application rejected",
    };
  } catch (error) {
    console.error("Update application status error:", error);
    return { success: false, error: "Failed to update application status" };
  }
}
