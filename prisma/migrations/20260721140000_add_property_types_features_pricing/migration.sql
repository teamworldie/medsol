-- AlterTable
ALTER TABLE "Property" ADD COLUMN "secondPrice" TEXT;
ALTER TABLE "Property" ADD COLUMN "pricePrefix" TEXT;
ALTER TABLE "Property" ADD COLUMN "landArea" TEXT;

-- CreateTable
CREATE TABLE "PropertyType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PropertyType_name_key" ON "PropertyType"("name");

-- CreateTable
CREATE TABLE "PropertyFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyFeature_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PropertyFeature_name_key" ON "PropertyFeature"("name");

-- Seed default property types
INSERT INTO "PropertyType" ("id", "name") VALUES
('pt_00000000000000000000', 'Residential'),
('pt_00000000000000000001', 'Apartment'),
('pt_00000000000000000002', 'Condo'),
('pt_00000000000000000003', 'Multi Family Home'),
('pt_00000000000000000004', 'Single Family Home'),
('pt_00000000000000000005', 'Studio'),
('pt_00000000000000000006', 'Villa'),
('pt_00000000000000000007', 'Bungalow'),
('pt_00000000000000000008', 'Business Center'),
('pt_00000000000000000009', 'Commercial'),
('pt_00000000000000000010', 'Office'),
('pt_00000000000000000011', 'Shop'),
('pt_00000000000000000012', 'Duplex'),
('pt_00000000000000000013', 'Duplex Penthouse'),
('pt_00000000000000000014', 'Penthouse'),
('pt_00000000000000000015', 'Plot'),
('pt_00000000000000000016', 'Plot with Project'),
('pt_00000000000000000017', 'Semi Detached House'),
('pt_00000000000000000018', 'Semi Detached Villa'),
('pt_00000000000000000019', 'Townhouse')
ON CONFLICT ("name") DO NOTHING;

-- Seed default property features
INSERT INTO "PropertyFeature" ("id", "name") VALUES
('pf_00000000000000000000', '2 - 3 Bathrooms'),
('pf_00000000000000000001', '2 - 4 Bedrooms'),
('pf_00000000000000000002', 'Gym'),
('pf_00000000000000000003', 'Spa'),
('pf_00000000000000000004', 'Swimming Pool'),
('pf_00000000000000000005', '1 - 2 Bathrooms'),
('pf_00000000000000000006', '1 - 4 Bedroom'),
('pf_00000000000000000007', '1 Bedroom'),
('pf_00000000000000000008', '1 En-suite Baths'),
('pf_00000000000000000009', '1 Guest Toilet'),
('pf_00000000000000000010', '1 Parking Slot'),
('pf_00000000000000000011', '10 Parking Slots'),
('pf_00000000000000000012', '12 Parking Slots'),
('pf_00000000000000000013', '13 Bathrooms'),
('pf_00000000000000000014', '18 Parking Slots'),
('pf_00000000000000000015', '2 - 5 Bathrooms'),
('pf_00000000000000000016', '2 Bathrooms'),
('pf_00000000000000000017', '2 bedrooms'),
('pf_00000000000000000018', '2 En-suite Baths'),
('pf_00000000000000000019', '2 Guest Toilets'),
('pf_00000000000000000020', '2 Parking Slots'),
('pf_00000000000000000021', '3 bathrooms'),
('pf_00000000000000000022', '3 Bedrooms'),
('pf_00000000000000000023', '3 En-suite Baths'),
('pf_00000000000000000024', '3 FLOORS'),
('pf_00000000000000000025', '3 Guest Toilets'),
('pf_00000000000000000026', '3 Parking Slots'),
('pf_00000000000000000027', '4 Bathrooms'),
('pf_00000000000000000028', '4 Bedrooms'),
('pf_00000000000000000029', '4 En-Suite Baths'),
('pf_00000000000000000030', '4 En-Suite Bedrooms'),
('pf_00000000000000000031', '4 Parking Slots'),
('pf_00000000000000000032', '5 bathrooms'),
('pf_00000000000000000033', '5 baths'),
('pf_00000000000000000034', '5 Bedrooms'),
('pf_00000000000000000035', '5 beds'),
('pf_00000000000000000036', '5 En-suite Baths'),
('pf_00000000000000000037', '5 Guest Toilets'),
('pf_00000000000000000038', '5 Parking Slots'),
('pf_00000000000000000039', '6 Bathrooms'),
('pf_00000000000000000040', '6 Bedrooms'),
('pf_00000000000000000041', '6 En-suite Baths'),
('pf_00000000000000000042', '6 En-suite Bedrooms'),
('pf_00000000000000000043', '6 Parking Slots'),
('pf_00000000000000000044', '7 Bathrooms'),
('pf_00000000000000000045', '7 Bedrooms'),
('pf_00000000000000000046', '7 En-suite Baths'),
('pf_00000000000000000047', '7 Parking Slots'),
('pf_00000000000000000048', '8 Bathrooms'),
('pf_00000000000000000049', '8 Bedrooms'),
('pf_00000000000000000050', '8 En-suite Baths'),
('pf_00000000000000000051', '8 Parking Slots'),
('pf_00000000000000000052', '9 Bathrooms'),
('pf_00000000000000000053', '9 Bedrooms'),
('pf_00000000000000000054', '9 En-suite Baths'),
('pf_00000000000000000055', 'Air Conditioning'),
('pf_00000000000000000056', 'Barbeque'),
('pf_00000000000000000057', 'Basement'),
('pf_00000000000000000058', 'BBQ Zone'),
('pf_00000000000000000059', 'Beach Side'),
('pf_00000000000000000060', 'Carport Garage'),
('pf_00000000000000000061', 'Chill-Out Lounge'),
('pf_00000000000000000062', 'Co-Working'),
('pf_00000000000000000063', 'Communal Garden'),
('pf_00000000000000000064', 'Communal Swimming Pool'),
('pf_00000000000000000065', 'Dryer'),
('pf_00000000000000000066', 'En-suits Baths'),
('pf_00000000000000000067', 'FLEXIBLE LAYOUTS'),
('pf_00000000000000000068', 'Garage'),
('pf_00000000000000000069', 'Garden'),
('pf_00000000000000000070', 'Gated Community'),
('pf_00000000000000000071', 'Indoor Gym'),
('pf_00000000000000000072', 'Infinity Pool'),
('pf_00000000000000000073', 'Landscaped Garden'),
('pf_00000000000000000074', 'Large Terraces'),
('pf_00000000000000000075', 'Laundry'),
('pf_00000000000000000076', 'Lawn'),
('pf_00000000000000000077', 'Lounge'),
('pf_00000000000000000078', 'Microwave'),
('pf_00000000000000000079', 'Mountain View'),
('pf_00000000000000000080', 'Outdoor Shower'),
('pf_00000000000000000081', 'Parking'),
('pf_00000000000000000082', 'PRIVATE COURTYARD'),
('pf_00000000000000000083', 'Private Garage'),
('pf_00000000000000000084', 'Private Garden'),
('pf_00000000000000000085', 'Private Pool'),
('pf_00000000000000000086', 'Refrigerator'),
('pf_00000000000000000087', 'Sauna'),
('pf_00000000000000000088', 'Sea View'),
('pf_00000000000000000089', 'Solarium'),
('pf_00000000000000000090', 'Terraces'),
('pf_00000000000000000091', 'TV Cable'),
('pf_00000000000000000092', 'Unimpaired Views'),
('pf_00000000000000000093', 'Washer'),
('pf_00000000000000000094', 'WiFi'),
('pf_00000000000000000095', 'Window Coverings')
ON CONFLICT ("name") DO NOTHING;
