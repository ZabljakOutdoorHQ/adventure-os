// Confirmed against docs/integrations/adventure-hub.md — every field here
// traces to the vendor API doc and/or the client team's empirical testing.
// Do not add fields that aren't confirmed in that document; add a note there
// first if a new field is observed.

export type AdventureHubTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AdventureHubMeetingPoint = {
  id: number;
  name: string;
};

export type AdventureHubAvailableDate = {
  availableFromMonth: number;
  availableFromDay: number;
  availableToMonth: number;
  availableToDay: number;
};

export type AdventureHubSlot = {
  id: number;
  time: string;
  active: boolean;
  availableDates: AdventureHubAvailableDate[];
};

// Capacity is confirmed ABSENT from this shape — no remainingCapacity,
// maxPerBooking, or available boolean exists in the live response.
export type AdventureHubAdventure = {
  id: number;
  name: string;
  description: string;
  price: number;
  adventureTypeId: number;
  active: boolean;
  timeLimit: string;
  isPickupLocationEnabled: boolean;
  meetingPoints: AdventureHubMeetingPoint[];
  slots: AdventureHubSlot[];
};

export type AdventureHubModalGroup = {
  adventures: AdventureHubAdventure[];
};

export type AdventureHubModalResponse = AdventureHubModalGroup[];

export type AdventureHubSeason = "summer" | "winter";

export type AdventureHubTotalPriceResponse = {
  name: string;
  amount: number;
  isValid: boolean;
  subtotalPrice: number;
  totalPrice: number;
};

export type AdventureHubTotalPriceParams = {
  adventureIds: number[];
  numberOfGuests: number[];
  discountCodeName?: string;
};
