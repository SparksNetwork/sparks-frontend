/* Data types from the database */
export type Arrival =
  {
    arrivedAt?: number,
    ownerProfileKey: User,
    profileKey: User,
    projectKey: string,
    projectKeyProfileKey?: string,
  }

export type Assignment =
  {
    engagementKey: string,
    oppKey: string,
    profileKey: User,
    shiftKey: string,
    teamKey: string,
  }

export type Commitment =
  {
    code: string,
    count: number,
    oppKey: string,
    party: string,
  }

export type Engagement =
  {
    declined: boolean,
    isAccepted: boolean,
    isApplied: boolean,
    isConfirmed: boolean,
    oppKey: string,
    paymentClientToken: string,
    profileKey: User,
    priority?: boolean, // old database stuff
    amountPaid?: number,
    isAssigned?: boolean,
    paymentError?: boolean,
    transaction?: Transaction
  }

export type Transaction =
  {
    amount: number,
    avsPostalCodeResponseCode: string,
    avsStreetAddressResponseCode: string,
    billing: Billing,
    createdAt: string,
    creditCard: CreditCard,
    currenyIsoCode: string,
    customFields: string,
    cvvResponseCode: string,
    id: string,
    merchantAccountId: string,
    paymentInstrumentType: string,
    processorAuthorizationCode: number,
    processorResponseCode: number,
    processorResponseText: string,
    processorSettlementResponseCode: string,
    processorSettlementResponseText: string,
    recurring: boolean,
    status: string,
    statusHistory: Status[],
    taxExempt: boolean,
    type: string,
    updatedAt: string,
  }

export type Billing =
  {
    postalCode: number,
  }

export type CreditCard =
  {
    bin: number,
    cardType: string,
    commercial: string,
    countryOfIssuance: string,
    customerLocation: string,
    debit: string,
    durbinRegulated: string,
    expirationDate: string,
    expirationMonth: string,
    expirationYear: string,
    healthcare: string,
    imageUrl: string,
    issuingBank: string,
    last4: number,
    maskedNumber: string,
    payroll: string,
    prepaid: string,
    productId: string,
    venmoSdk: boolean
  }

export type Status =
  {
    amount: string,
    status: string,
    timestamp: string,
    transactionSource: string,
    user: User,
  }

export type Fulfiller =
  {
    authorProfileKey: User,
    oppKey: string,
    teamKey: string,
  }

export type Membership =
  {
    answer: string,
    engagementKey: string,
    isAccepted: boolean,
    isApplied: boolean,
    isConfirmed: boolean,
    isDeclined: boolean,
    oppKey: string,
    teamKey: string,
  }

export type Opp =
  {
    authorProfileKey: User,
    confirmationsOn: boolean,
    description: string,
    isPublic: boolean,
    name: string,
    projectKey: string,
    question: string,
    project?: Project // from old stuff?
  }

export type Authority = 'owner' | 'manager';
export type Organizer =
  {
    authority: Authority,
    authorProfileKey: string,
    inviteEmail: string,
    projectKey: string,
    acceptedAt?: number,
    invitedByProfileKey?: string,
    isAccepted?: boolean,
    profileKey?: User,
  }

export type Profile =
  {
    email: string,
    fullName: string,
    intro: string,
    isAdmin: boolean,
    isConfirmed: true,
    phone: string,
    portraitUrl: true,
    skills: string,
    uid: string,
    isEAP?: boolean,
  }

export type ProjectImage =
  {
    dataUrl: string,
  }

export type Project =
  {
    description: string,
    facebookImageUrl?: string,
    name: string,
    ownerProfileKey: string,
  }

export type Shift =
  {
    assigned: number,
    date: string,
    end: string,
    hours: number,
    ownerProfileKey: User,
    peope: number,
    reserved?: number,
    start: string,
    teamKey: string,
  }

export type TeamImage =
  {
    dataUrl: string,
  }


export type Team =
  {
    authorProfileKey: string,
    description: string,
    name: string,
    projectKey: string,
    question: string,
    project?: Project,
  }

export type User = string;
