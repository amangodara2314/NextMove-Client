import { Flag, Handshake } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Loader from "../Loader";

export default function DrawResignButtons({ handleOfferDraw }) {
  const [loading, setLoading] = useState(false);
  const handleOfferDrawClick = async (action) => {
    setLoading(true);
    await handleOfferDraw();
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <Button onClick={() => handleOfferDrawClick("resign")} disabled={loading}>
        Resign <Flag />
      </Button>
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
