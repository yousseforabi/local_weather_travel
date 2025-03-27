export type TrafficApiResponse = {
    RESPONSE?: {
        RESULT?: {
            Situation?: {
            Id: string;
            CountryCode: string;
            PublicationTime: string;
            locationdescriptor?: string;
            Deviation?: {
                Message?: string;
                IconId?: string;
            }[];
            }[];
        }[];
    };
};
  
export type TrafficData = {
  Id: string;
  CountryCode: string;
  PublicationTime: string;
  Description: string;
  Message?: string;
  Icon?: string;
};