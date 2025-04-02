import { ReactNode } from "react";

export type TrafficApiResponse = {
    RESPONSE?: {
        RESULT?: {
            Situation?: {
                Id: string;
                CountryCode: string;
                PublicationTime: string;
                Deviation?: {
                    Message?: string;
                    LocationDescriptor?: string;
                }[];
            }[];
        }[];
    };
};
  
export type TrafficData = {
  [x: string]: ReactNode;
  Id: string;
  CountryCode: string;
  PublicationTime: string;
  Description: string;
  Message?: string;
  Icon?: string;
};