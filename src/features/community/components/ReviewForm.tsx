"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { submitReview } from "../actions/submit-review";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star, X } from "lucide-react";
import { toast } from "sonner";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type ReviewData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  organizationId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({ organizationId, onSuccess, onCancel }: Readonly<ReviewFormProps>) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewData>({
    resolver: zodResolver(reviewSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ReviewData) => submitReview({ ...data, organizationId }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    },
  });

  const handleRatingClick = (value: number) => {
    setRating(value);
    setValue("rating", value, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewData) => {
    await mutation.mutateAsync(data);
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-[#111111] border border-[#2A2A2A] rounded-2xl space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
          Write a Review
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-[#1C1C1C] rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-[#666666]" />
        </button>
      </div>

      <div>
        <Label className="text-base text-[#F0F0F0] mb-4 block font-medium">Rate your experience</Label>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`h-10 w-10 ${
                  star <= (hoverRating || rating)
                    ? "fill-[#E8D87E] text-[#E8D87E]"
                    : "text-[#2A2A2A]"
                }`}
              />
            </button>
          ))}
          {(hoverRating || rating) > 0 && (
            <span className="ml-2 text-[#AAAAAA] text-sm">
              {ratingLabels[(hoverRating || rating) - 1]}
            </span>
          )}
        </div>
        {errors.rating && <p className="text-sm text-[#F97C7C] mt-2">{errors.rating.message}</p>}
      </div>

      <div>
        <Label className="text-base text-[#F0F0F0] mb-3 block font-medium">Share your thoughts</Label>
        <Textarea
          {...register("comment")}
          placeholder="What was your experience like working here? Share details about the culture, work environment, management, growth opportunities, etc."
          className="bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[160px] text-[15px] leading-relaxed focus:border-[#7EE8A2]"
        />
        {errors.comment && <p className="text-sm text-[#F97C7C] mt-2">{errors.comment.message}</p>}
        <p className="text-xs text-[#666666] mt-2">Minimum 10 characters</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-transparent border border-[#2A2A2A] text-[#AAAAAA] hover:bg-[#1C1C1C] hover:text-[#F0F0F0] h-12"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891] h-12 font-semibold"
        >
          {mutation.isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
