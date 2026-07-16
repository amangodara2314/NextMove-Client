import { useEffect, useState } from "react";
import { getTimeControlSettings } from "../services/game/gameServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";

export default function useTimeControlSettings() {
  const [type, setType] = useState("");
  const [types, setTypes] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [error, setErrors] = useState("");

  const fetchTimeControlSettings = async () => {
    try {
      setLoadingSettings(true);
      const response = await getTimeControlSettings();
      const data = getResponseData(response);
      const { types, ...setting } = data;
      setTypes(types);
      setSettings(setting);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrors(message);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchTimeControlSettings();
  }, []);

  return { type, setType, types, settings, loadingSettings, error };
}
