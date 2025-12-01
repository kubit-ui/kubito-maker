import { ReactElement } from "react";

export interface Body {
  id: string;
  name: string;
  svg?: ReactElement;
  svgPath?: string;
}

export const bodies: Body[] = [
  {
    id: "body1",
    name: "Original Body",
    svgPath: "/assets/svg/bodies/body1.svg",
  },
  {
    id: "body2",
    name: "Alternative Body",
    svgPath: "/assets/svg/bodies/body2.svg",
  },
  {
    id: "kubito-02",
    name: "Pixel Art Body",
    svgPath: "/assets/svg/bodies/Kubito-02.svg",
  },
  {
    id: "kubito-03",
    name: "Outline Body",
    svgPath: "/assets/svg/bodies/Kubito-03.svg",
  },
  {
    id: "kubito-04",
    name: "Gradient Body",
    svgPath: "/assets/svg/bodies/Kubito-04.svg",
  },
  {
    id: "kubito-3d-gray",
    name: "3D Gray Body",
    svgPath: "/assets/svg/bodies/Kubito_3D_gray.svg",
  },
];
