import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { selectUser } from "../features/auth/authSelectors";
import { useForm } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "../components/ui/input";
import RatingStats from "../components/home/RatingStats";
import {
  selectLoadingRatings,
  selectRatings,
  selectRatingsError,
} from "../features/rating/ratingSelectors";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function Profile() {
  const user = useSelector(selectUser);
  const ratings = useSelector(selectRatings);
  const loadingRatings = useSelector(selectLoadingRatings);
  const ratingsError = useSelector(selectRatingsError);
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="h-full bg-background">
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-10 sm:py-14 space-y-8">
        <h1
          className="text-5xl leading-[1.1] text-foreground sm:text-6xl"
          style={{ fontFamily: "'Newsreader', serif" }}
        >
          Your Profile
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
          <div className="">
            <Avatar className="size-42 md:size-72">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="text-5xl md:text-8xl">
                {user?.username?.charAt(0) || "CN"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="sm:place-self-start">
            <FieldSet>
              <Field className="sm:w-3/4">
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  autoComplete="off"
                  placeholder="Enter your username"
                  defaultValue={user?.username}
                />
                <FieldDescription>
                  This is your public username that will be displayed to other
                  users.
                </FieldDescription>
              </Field>
              <Field orientation="horizontal" className="sm:w-3/4 justify-end">
                {isEditing ? (
                  <>
                    {" "}
                    <Button
                      variant="outline"
                      type="button"
                      onClick={toggleEditing}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={toggleEditing}
                  >
                    Edit
                  </Button>
                )}
              </Field>
            </FieldSet>
          </div>
        </div>

        <RatingStats
          ratings={ratings}
          loading={loadingRatings}
          error={ratingsError}
        />
      </div>
    </div>
  );
}
