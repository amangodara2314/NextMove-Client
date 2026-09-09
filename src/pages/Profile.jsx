import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { selectUser } from "../features/auth/authSelectors";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
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
import { toast } from "sonner";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import { updateProfile } from "../services/auth/authServices";
import { setUser } from "../features/auth/authSlice";

export default function Profile() {
  const user = useSelector(selectUser);
  const ratings = useSelector(selectRatings);
  const loadingRatings = useSelector(selectLoadingRatings);
  const ratingsError = useSelector(selectRatingsError);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (userName.trim() === "") {
      toast.error("Username cannot be empty.");
    }

    if (userName.trim() === user?.username) {
      toast.error("Username is already in use.");
    }

    if (userName.trim().length < 3) {
      toast.error("Username must be at least 3 characters long.");
    }

    if (userName.trim().length > 20) {
      toast.error("Username cannot be longer than 20 characters.");
    }
    setLoading(true);

    try {
      const response = await updateProfile({ username: userName });
      const data = getResponseData(response);
      setIsEditing(false);
      setUserName(data.username);
      dispatch(setUser({ user: { ...data, username: data.username } }));
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.log("Error updating profile:", error);
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const shouldDisable =
    !isEditing ||
    userName.trim() === "" ||
    userName.trim() === user?.username ||
    userName.trim().length > 20 ||
    userName.trim().length < 3;

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
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
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
                    <Button
                      onClick={handleSubmit}
                      disabled={shouldDisable || loading}
                      type="submit"
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
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
