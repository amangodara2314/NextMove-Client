import { Flag, Handshake } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Loader from "../Loader";
import ConfirmationDialog from "../ConfirmationDialog";

export default function DrawResignButtons({ handleOfferDraw }) {
  const [loading, setLoading] = useState(false);
  const handleOfferDrawClick = async (action) => {
    setLoading(true);
    await handleOfferDraw();
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <ConfirmationDialog
        title="Confirm Resignation"
        description="Are you sure you want to resign this game?"
        triggerButtonProps={{
          asChild: true,
        }}
      >
        <Button className="w-full" variant="destructive" disabled={loading}>
          Resign
        </Button>
      </ConfirmationDialog>
      <Button onClick={() => handleOfferDrawClick("offer")} disabled={loading}>
        {loading ? (
          <Loader />
        ) : (
          <>
            Offer Draw <Handshake />
          </>
        )}
      </Button>
    </div>
  );
}
