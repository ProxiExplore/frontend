export interface Place {
    displayName: {
        languageCode: string;
        text: string;
    };
    formattedAddress: string;
    geo: {
        lat: number;
        lon: number;
    };
    internationalPhoneNumber: string;
    javaClass: string;
}
