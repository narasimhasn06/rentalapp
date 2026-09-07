// Static demo content for the RentRoll seed design (ticket C2).
//
// Everything here is either (a) content with no date sensitivity — names,
// addresses, amounts, categories — or (b) a *day offset* rather than a
// literal date. `scripts/seed/generate.mjs` resolves every offset against
// the moment it runs, per spec/screens' "relative to the run date"
// requirement — see scripts/seed/SPEC.md "Date handling".
//
// This file intentionally uses only vocabulary that already appears in
// spec/screens/**.md's own component tables (rent due, amount paid, due
// date, category, urgency, deposit held, deduction description/reason/
// amount/photo, ...). It is demo *content*, not a database schema — see
// scripts/seed/SPEC.md for the TODO(schema) list of what a real schema
// still needs to define.

export const landlord = {
  name: "Rohan Kulkarni",
  receiptName: "Kulkarni Properties",
  upiId: "rohankulkarni@okhdfcbank",
  accountantEmail: "ca.deshpande.associates@example.com",
  // Defaults per spec/screens/landlord/L-15-settings.md
  reminderLadderDays: [3, 10, 20],
  rentEscalationDefaultPercent: 8,
};

export const properties = [
  {
    id: "prop-kulkarni-apts",
    name: "Kulkarni Apartments",
    address: "Survey No. 24, Karve Road, Kothrud, Pune 411038",
  },
  {
    id: "prop-om-sai",
    name: "Om Sai Residency",
    address: "Baner–Pashan Link Road, Baner, Pune 411045",
  },
];

/**
 * status: "occupied" | "vacant"
 * deposit is 2x monthlyRent — a demo-data convention, not a product rule.
 * See scripts/seed/SPEC.md "Assumptions made for realism".
 */
export const units = [
  { id: "unit-1a", propertyId: "prop-kulkarni-apts", unitNumber: "1A", type: "1BHK", monthlyRent: 16000, deposit: 32000, status: "occupied" },
  { id: "unit-1b", propertyId: "prop-kulkarni-apts", unitNumber: "1B", type: "1BHK", monthlyRent: 16000, deposit: 32000, status: "occupied" },
  { id: "unit-2a", propertyId: "prop-kulkarni-apts", unitNumber: "2A", type: "2BHK", monthlyRent: 18000, deposit: 36000, status: "occupied" },
  { id: "unit-2b", propertyId: "prop-kulkarni-apts", unitNumber: "2B", type: "2BHK", monthlyRent: 18500, deposit: 37000, status: "occupied" },
  { id: "unit-3a", propertyId: "prop-kulkarni-apts", unitNumber: "3A", type: "1BHK", monthlyRent: 15500, deposit: 31000, status: "vacant" },
  { id: "unit-3b", propertyId: "prop-kulkarni-apts", unitNumber: "3B", type: "2BHK", monthlyRent: 16000, deposit: 32000, status: "occupied" },
  { id: "unit-4a", propertyId: "prop-kulkarni-apts", unitNumber: "4A", type: "2BHK", monthlyRent: 20000, deposit: 40000, status: "occupied" },
  { id: "unit-4c", propertyId: "prop-kulkarni-apts", unitNumber: "4C", type: "1BHK", monthlyRent: 18000, deposit: 36000, status: "occupied" },

  { id: "unit-g1", propertyId: "prop-om-sai", unitNumber: "G1", type: "1RK", monthlyRent: 11000, deposit: 22000, status: "occupied" },
  { id: "unit-g2", propertyId: "prop-om-sai", unitNumber: "G2", type: "1RK", monthlyRent: 11500, deposit: 23000, status: "vacant" },
  { id: "unit-1c", propertyId: "prop-om-sai", unitNumber: "1C", type: "1BHK", monthlyRent: 14000, deposit: 28000, status: "occupied" },
  { id: "unit-1d", propertyId: "prop-om-sai", unitNumber: "1D", type: "1BHK", monthlyRent: 14500, deposit: 29000, status: "occupied" },
  { id: "unit-2c", propertyId: "prop-om-sai", unitNumber: "2C", type: "2BHK", monthlyRent: 21000, deposit: 42000, status: "occupied" },
  { id: "unit-2d", propertyId: "prop-om-sai", unitNumber: "2D", type: "2BHK", monthlyRent: 21500, deposit: 43000, status: "occupied" },
];

/**
 * Current tenants (one per occupied unit) and past tenants (one per
 * vacant unit, for rent/settlement history — spec/product.md notes each
 * unit has "a history of past tenants").
 *
 * rent.scenario: "paid" | "overdue" | "partPaid"
 * rent.dueDaysAgo / paidDaysAgo / amountPaid describe the *current
 * month's* row only; two clean prior-month rows are generated
 * automatically (see generate.mjs) so payment history isn't just one row.
 *
 * agreement.startDaysAgo / endOffsetDays: endOffsetDays > 0 means the
 * agreement ends that many days in the future; < 0 means it already
 * ended that many days ago.
 */
export const currentTenants = [
  {
    id: "tenant-rohit-sharma",
    unitId: "unit-1a",
    name: "Rohit Sharma",
    phone: "+91 98220 11001",
    email: "rohit.sharma@example.com",
    rent: { scenario: "paid", dueDaysAgo: 9, paidDaysAgo: 9 },
    agreement: { startDaysAgo: 275, endOffsetDays: 90, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-ananya-iyer",
    unitId: "unit-1b",
    name: "Ananya Iyer",
    phone: "+91 98220 11002",
    email: "ananya.iyer@example.com",
    rent: { scenario: "paid", dueDaysAgo: 8, paidDaysAgo: 8 },
    agreement: { startDaysAgo: 185, endOffsetDays: 180, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-meera-desai",
    unitId: "unit-2a",
    name: "Meera Desai",
    phone: "+91 98220 11003",
    email: "meera.desai@example.com",
    // Deterministic demo situation: rent ~5 days overdue.
    rent: { scenario: "overdue", dueDaysAgo: 5 },
    agreement: { startDaysAgo: 65, endOffsetDays: 300, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-prakash-joshi",
    unitId: "unit-2b",
    name: "Prakash Joshi",
    phone: "+91 98220 11004",
    email: "prakash.joshi@example.com",
    rent: { scenario: "paid", dueDaysAgo: 9, paidDaysAgo: 9 },
    agreement: { startDaysAgo: 215, endOffsetDays: 150, noticeGiven: false },
    // Deterministic demo situation: move-in photos missing.
    moveInPhotos: false,
  },
  {
    id: "tenant-neha-kulkarni",
    unitId: "unit-3b",
    name: "Neha Kulkarni",
    phone: "+91 98220 11006",
    email: "neha.kulkarni@example.com",
    // Deterministic demo situation: part-paid rent, ₹4,000 pending
    // (matches spec/screens/landlord/L-04-rent-due-board.md's own example).
    rent: { scenario: "partPaid", dueDaysAgo: 6, paidDaysAgo: 2, amountPaid: 12000 },
    agreement: { startDaysAgo: 125, endOffsetDays: 240, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-ganesh-pawar",
    unitId: "unit-4a",
    name: "Ganesh Pawar",
    phone: "+91 98220 11007",
    email: "ganesh.pawar@example.com",
    rent: { scenario: "paid", dueDaysAgo: 10, paidDaysAgo: 10 },
    // Deterministic demo situation: notice given, move-out in progress.
    agreement: {
      startDaysAgo: 245,
      endOffsetDays: 120,
      noticeGiven: true,
      noticeGivenDaysAgo: 20,
      moveOutDaysFromNow: 10,
    },
    moveInPhotos: true,
  },
  {
    id: "tenant-suresh-khan",
    unitId: "unit-4c",
    name: "Suresh Khan",
    phone: "+91 98220 11008",
    email: "suresh.khan@example.com",
    // Deterministic demo situation: rent ~18 days overdue, level 3 of 3 —
    // matches spec/screens/shared/S-01-message-composer.md's own example
    // ("Message to Suresh Khan · Flat 4C", "18 days overdue · Level 3 of 3").
    rent: { scenario: "overdue", dueDaysAgo: 18 },
    agreement: { startDaysAgo: 300, endOffsetDays: 65, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-farhan-shaikh",
    unitId: "unit-g1",
    name: "Farhan Shaikh",
    phone: "+91 90211 22001",
    email: "farhan.shaikh@example.com",
    rent: { scenario: "paid", dueDaysAgo: 7, paidDaysAgo: 7 },
    agreement: { startDaysAgo: 165, endOffsetDays: 200, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-priya-nair",
    unitId: "unit-1c",
    name: "Priya Nair",
    phone: "+91 90211 22003",
    email: "priya.nair@example.com",
    rent: { scenario: "paid", dueDaysAgo: 6, paidDaysAgo: 6 },
    // Deterministic demo situation: agreement expiring in ~18 days.
    agreement: { startDaysAgo: 347, endOffsetDays: 18, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-vikram-rao",
    unitId: "unit-1d",
    name: "Vikram Rao",
    phone: "+91 90211 22004",
    email: "vikram.rao@example.com",
    rent: { scenario: "paid", dueDaysAgo: 8, paidDaysAgo: 8 },
    // Deterministic demo situation: agreement expiring in ~45 days.
    agreement: { startDaysAgo: 320, endOffsetDays: 45, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-sneha-bhat",
    unitId: "unit-2c",
    name: "Sneha Bhat",
    phone: "+91 90211 22005",
    email: "sneha.bhat@example.com",
    rent: { scenario: "paid", dueDaysAgo: 9, paidDaysAgo: 9 },
    // Deterministic demo situation: agreement expired ~14 days ago,
    // not yet renewed (matches L-12's own "Expired 14 days ago" example).
    agreement: { startDaysAgo: 379, endOffsetDays: -14, noticeGiven: false },
    moveInPhotos: true,
  },
  {
    id: "tenant-abhijit-kulkarni",
    unitId: "unit-2d",
    name: "Abhijit Kulkarni",
    phone: "+91 90211 22006",
    email: "abhijit.kulkarni@example.com",
    rent: { scenario: "paid", dueDaysAgo: 7, paidDaysAgo: 7 },
    // Deterministic demo situation: agreement expiring in ~75 days.
    agreement: { startDaysAgo: 290, endOffsetDays: 75, noticeGiven: false },
    moveInPhotos: true,
  },
];

export const pastTenants = [
  {
    id: "tenant-aarti-bhosale",
    unitId: "unit-3a",
    name: "Aarti Bhosale",
    phone: "+91 98220 11099",
    agreement: { startDaysAgo: 420, endOffsetDays: -55 },
    moveInPhotos: true,
    settlement: {
      id: "settlement-aarti-bhosale",
      depositHeld: 31000,
      deductions: [],
      settledDaysAgo: 55,
    },
  },
  {
    id: "tenant-imran-sheikh",
    unitId: "unit-g2",
    name: "Imran Sheikh",
    phone: "+91 90211 22099",
    agreement: { startDaysAgo: 480, endOffsetDays: -115 },
    moveInPhotos: true,
    settlement: {
      id: "settlement-imran-sheikh",
      depositHeld: 23000,
      deductions: [
        {
          description: "Wall repainting after long tenancy",
          reason: "Walls required repainting beyond normal wear after a multi-year tenancy",
          amount: 2500,
          photo: true,
        },
      ],
      settledDaysAgo: 115,
    },
  },
];

/**
 * In-progress settlement for the notice/move-out demo tenant. Kept
 * separate from currentTenants' plain fields since it references a
 * maintenance request (see maintenanceRequests, MR-12) — mirrors
 * L13-BTN-FROMREQUESTS "Pull from repair history".
 */
export const inProgressSettlement = {
  id: "settlement-ganesh-pawar",
  tenantId: "tenant-ganesh-pawar",
  unitId: "unit-4a",
  depositHeld: 40000,
  status: "draft",
  deductions: [
    {
      description: "Cracked bathroom tile repair",
      reason: "Damage beyond normal wear and tear, noted at move-out inspection",
      amount: 1200,
      photo: true,
      pulledFromRequestId: "mr-12",
    },
    {
      description: "Deep cleaning before next tenant",
      reason: "Kitchen and bathroom left uncleaned at inspection",
      amount: 800,
      photo: false,
    },
  ],
};

/**
 * category: one of the fixed options in L07-SEL-CATEGORY / T01-SEL-CATEGORY
 * (Plumbing, Electrical, Appliance, Structural, Pest, Cleaning, Other).
 * status: "New" | "Assigned" | "In progress" | "Done"
 * cost: number of rupees, or null if not yet costed / genuinely free.
 * noCost: true marks a deliberate "no cost" close (L06/L07 rule: closing
 * a request requires either a cost or an explicit "no cost").
 */
export const maintenanceRequests = [
  {
    id: "mr-1",
    unitId: "unit-1b",
    category: "Plumbing",
    urgency: "Normal",
    description: "Kitchen tap is leaking continuously",
    status: "New",
    reportedDaysAgo: 0,
    photos: 1,
  },
  {
    id: "mr-2",
    unitId: "unit-2b",
    category: "Electrical",
    urgency: "Urgent",
    description: "Living room switchboard sparks when the fan is switched on",
    status: "New",
    reportedDaysAgo: 0,
    photos: 1,
  },
  {
    id: "mr-3",
    unitId: "unit-4c",
    category: "Plumbing",
    urgency: "Urgent",
    description: "Geyser is leaking from the bottom since yesterday",
    status: "Assigned",
    reportedDaysAgo: 3,
    vendor: { name: "Om Plumbing Services", phone: "+91 98221 30001" },
    photos: 1,
  },
  {
    id: "mr-4",
    unitId: "unit-2a",
    category: "Structural",
    urgency: "Low",
    description: "Bedroom window latch is broken and will not lock",
    status: "New",
    reportedDaysAgo: 9,
    photos: 1,
  },
  {
    id: "mr-5",
    unitId: "unit-1d",
    category: "Pest",
    urgency: "Normal",
    description: "Ants near the kitchen sink",
    status: "New",
    reportedDaysAgo: 5,
    photos: 0,
  },
  {
    id: "mr-6",
    unitId: "unit-2c",
    category: "Electrical",
    urgency: "Normal",
    description: "Corridor light outside the flat is not working",
    status: "In progress",
    reportedDaysAgo: 6,
    vendor: { name: "Deshmukh Electricals", phone: "+91 90211 40002" },
    photos: 1,
  },
  {
    id: "mr-7",
    unitId: "unit-2d",
    category: "Plumbing",
    urgency: "Normal",
    description: "Bathroom drain is slow",
    status: "Done",
    reportedDaysAgo: 15,
    closedDaysAgo: 10,
    vendor: { name: "Om Plumbing Services", phone: "+91 98221 30001" },
    cost: 600,
    photos: 2,
  },
  {
    id: "mr-8",
    unitId: "unit-g1",
    category: "Appliance",
    urgency: "Low",
    description: "Water purifier filter needs replacement",
    status: "Done",
    reportedDaysAgo: 20,
    closedDaysAgo: 18,
    cost: 0,
    noCost: true,
    photos: 1,
  },
  {
    id: "mr-9",
    unitId: "unit-4c",
    category: "Plumbing",
    urgency: "Normal",
    description: "Kitchen mixer tap replaced",
    status: "Done",
    reportedDaysAgo: 70,
    closedDaysAgo: 68,
    vendor: { name: "Om Plumbing Services", phone: "+91 98221 30001" },
    cost: 350,
    photos: 1,
  },
  {
    id: "mr-10",
    unitId: "unit-4c",
    category: "Plumbing",
    urgency: "Normal",
    description: "Bathroom flush tank repaired",
    status: "Done",
    reportedDaysAgo: 150,
    closedDaysAgo: 147,
    vendor: { name: "Om Plumbing Services", phone: "+91 98221 30001" },
    cost: 450,
    photos: 1,
  },
  {
    id: "mr-11",
    unitId: "unit-4c",
    category: "Plumbing",
    urgency: "Normal",
    description: "Geyser pressure valve serviced",
    status: "Done",
    reportedDaysAgo: 260,
    closedDaysAgo: 257,
    vendor: { name: "Om Plumbing Services", phone: "+91 98221 30001" },
    cost: 300,
    photos: 0,
  },
  {
    id: "mr-12",
    unitId: "unit-4a",
    category: "Structural",
    urgency: "Normal",
    description: "Cracked tile in bathroom, noted at move-out inspection",
    status: "Done",
    reportedDaysAgo: 20,
    closedDaysAgo: 19,
    cost: 1200,
    tenantLiable: true,
    photos: 1,
  },
];
