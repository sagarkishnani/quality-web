import { mediaUrl } from "../../utils/mediaUrl";

export const checkboxIcon = (checked: boolean) =>
  mediaUrl(checked ? "/images/brand/checkbox.svg" : "/images/brand/checkbox-vacio.svg");
