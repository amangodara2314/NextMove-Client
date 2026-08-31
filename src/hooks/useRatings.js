import { useEffect, useState } from "react";
import { getUserRatings } from "../services/rating/ratingServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRatingsFailure,
  fetchRatingsStart,
  fetchRatingsSuccess,
} from "../features/rating/ratingSlice";
import { selectRating } from "../features/rating/ratingSelectors";

export default function useRatings() {
  const { ratings, loadingRatings, ratingsError } = useSelector(selectRating);
  const dispatch = useDispatch();

  const fetchRatings = async () => {
    try {
      dispatch(fetchRatingsStart());
      const response = await getUserRatings();
      const data = getResponseData(response);
      dispatch(fetchRatingsSuccess(data));
    } catch (error) {
      dispatch(fetchRatingsFailure(getErrorMessage(error)));
    }
  };

  useEffect(() => {
    if (ratings && ratings.length !== 0) return;

    fetchRatings();
  }, []);

  return { ratings, loadingRatings, ratingsError, fetchRatings };
}
