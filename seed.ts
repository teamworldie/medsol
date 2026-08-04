import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { slugify } from './src/lib/slug';
import { ensureMediaBucket, uploadPublicAsset } from './src/lib/uploadAsset';
import { calculateReadTime } from './src/lib/readTime';

const prisma = new PrismaClient({});

type SeedAreaRow = { label: string; value: string; type?: 'header' | 'total' | 'normal' };

type SeedVilla = {
  name: string;
  description: string;
  image: string;
  price: string;
  beds: string;
  baths: string;
  plot: string;
  build: string;
  gallery: string[];
  floorplanImage?: string;
  pdfUrl?: string;
  areaData?: SeedAreaRow[];
};

const omalaVillas: SeedVilla[] = [
  {
    name: 'Villa Melissa',
    description: 'Comfort, brightness, and avant-garde character define the Melissa Villas. Every space has been designed to make the most of an exceptional natural setting.',
    image: '/assets/images/fachada piscina noche.webp',
    price: '335.300€',
    beds: '3', baths: '2', plot: '400 - 1,000 m²', build: '111 m²',
    gallery: [
      '/assets/images/Omala - Villa Melissa/Omala-Residences-Villa-Melissa-001.webp',
      '/assets/images/Omala - Villa Melissa/Omala-Residences-Villa-Melissa-002.webp',
      '/assets/images/Omala - Villa Melissa/Omala-Residences-Villa-Melissa-003.webp',
      '/assets/images/Omala - Villa Melissa/omala-residences-melissa-cocina-scaled.webp',
      '/assets/images/Omala - Villa Melissa/omala-residences-melissa-comedor-cocina-scaled.webp',
      '/assets/images/Omala - Villa Melissa/omala-residences-villa-melissa-bano-1.webp',
      '/assets/images/Omala - Villa Melissa/omala-residences-villa-melissa-dorm-2-1.webp',
      '/assets/images/Omala - Villa Melissa/omala-residences-villa-melissa-fachada-piscina-dia-1.webp',
      '/assets/images/Omala - Villa Melissa/omala-residences-villa-melissa-piscina-001.webp',
      '/assets/images/Omala - Villa Melissa/omala-residences-villa-melissa-puerta-principal-1.webp',
      '/assets/images/Omala - Villa Melissa/omala-residences-villa-melissa-vista-aerea.webp',
    ],
    floorplanImage: '/assets/images/Omala-Residences-Villa-Melissa-1200x1164.webp',
    pdfUrl: '/assets/Omala_MemoriaCalidades_Melissa.pdf',
    areaData: [
      { label: 'Superficies útiles', value: 'M²', type: 'header' },
      { label: 'Living-Dining Room-Kitchen', value: '37,50m' },
      { label: 'Bedroom 1', value: '14,20m' },
      { label: 'Bedroom 2', value: '10,75m' },
      { label: 'Bedroom 3', value: '10,10m' },
      { label: 'Bathroom 1', value: '4,00m' },
      { label: 'Bathroom 2', value: '4,00m' },
      { label: 'Total Usable Area', value: 'M²', type: 'header' },
      { label: 'Porch', value: '32,85m' },
      { label: 'Garage', value: '38,75m' },
      { label: 'Built Surfaces', value: 'M²', type: 'header' },
      { label: 'Dwelling 100%', value: '95,00m' },
      { label: 'Porch 50%', value: '16,43m' },
      { label: 'Total Plot Surface', value: '409,06m', type: 'total' },
    ],
  },
  {
    name: 'Villa Colia',
    description: 'Nature, comfort, and Mediterranean essence. A refuge where architecture engages in dialogue with the landscape to offer an authentic living experience. Includes walk-in closet, laundry room, and a covered garage of 30 m².',
    image: '/assets/images/Fachada piscina diurna.webp',
    price: '476.960€',
    beds: '3', baths: '2 + 1 Guest', plot: '720 - 830 m²', build: '146 m²',
    gallery: [
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-001.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-002.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-003.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-bano-principal.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-fachada-piscina-diurna.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-fachada-piscina-nocturna.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-fachada-puerta-principal.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-salon-2.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-salon.webp',
      '/assets/images/Omala - Villa Colia/omala-residences-villa-colia-vista-aerea-golf.webp',
    ],
    floorplanImage: '/assets/images/Omala-Residences-plano-colia-1200x1177.webp',
    pdfUrl: '/assets/Omala_MemoriaCalidades_Colia.pdf',
    areaData: [
      { label: 'Superficies útiles', value: 'M²', type: 'header' },
      { label: 'Living-Dining Room-Kitchen', value: '41,60m' },
      { label: 'Hall', value: '6,20m' },
      { label: 'Corridor', value: '4,10m' },
      { label: 'Bedroom 1', value: '19,40m' },
      { label: 'Bedroom 2', value: '9,70m' },
      { label: 'Bedroom 3', value: '5,05m' },
      { label: 'Bathroom 1', value: '5,05m' },
      { label: 'Bathroom 2', value: '3,80m' },
      { label: 'Laundry Room', value: '3,80m' },
      { label: 'Guest Toilet', value: '' },
      { label: 'Total Usable Area', value: 'M²', type: 'header' },
      { label: 'Swimming Pool', value: '21,45m' },
      { label: 'Porch', value: '13,70m' },
      { label: 'Garage', value: '30,00m' },
      { label: 'Built Surfaces', value: 'M²', type: 'header' },
      { label: 'Dwelling 100%', value: '139,60m' },
      { label: 'Porche 50%', value: '6,85m' },
      { label: 'Built Home Surface', value: 'M²', type: 'header' },
      { label: 'Garaje 50%', value: '15,00m' },
      { label: 'Total Plot Surface', value: '791,95m', type: 'total' },
    ],
  },
  {
    name: 'Villa Stella',
    description: 'Spacious, elegant, and practical. A residence that combines contemporary design to offer a sophisticated and effortless lifestyle. Includes a garage of 28 m².',
    image: '/assets/images/Fachada piscina HD.webp',
    price: '475.420€',
    beds: '3', baths: '2 + 1 Guest', plot: '701 - 763 m²', build: '146 m²',
    gallery: [
      '/assets/images/Omala - Villa Stella/Omala-Residences-Villa-Stella-001-1.webp',
      '/assets/images/Omala - Villa Stella/Omala-Residences-Villa-Stella-002.webp',
      '/assets/images/Omala - Villa Stella/Omala-Residences-Villa-Stella-003.webp',
      '/assets/images/Omala - Villa Stella/Omala-Residences-Villa-Stella-004.webp',
      '/assets/images/Omala - Villa Stella/omala-residences-villa-stella-aseo.webp',
      '/assets/images/Omala - Villa Stella/omala-residences-villa-stella-bano-2.webp',
      '/assets/images/Omala - Villa Stella/omala-residences-villa-stella-bano-principal.webp',
      '/assets/images/Omala - Villa Stella/omala-residences-villa-stella-comedor.webp',
      '/assets/images/Omala - Villa Stella/omala-residences-villa-stella-dormitorio-2.webp',
      '/assets/images/Omala - Villa Stella/omala-residences-villa-stella-fachada-piscina.webp',
      '/assets/images/Omala - Villa Stella/omala-residences-villa-stella-fachada-puerta-principal.webp',
    ],
    floorplanImage: '/assets/images/Omala-Residences-Plano-Stella-1200x1205.webp',
    pdfUrl: '/assets/Omala_MemoriaCalidades_Stella.pdf',
    areaData: [
      { label: 'Superficies útiles', value: 'M²', type: 'header' },
      { label: 'Salón-Comedor-Cocina', value: '41,70m' },
      { label: 'Hallway', value: '4,50m' },
      { label: 'Step', value: '5,70m' },
      { label: 'Bedroom 1', value: '14,25m' },
      { label: 'Bedroom 2', value: '9,05m' },
      { label: 'Bedroom 3', value: '9,70m' },
      { label: 'Bathroom 1', value: '7,70m' },
      { label: 'Bathroom 2', value: '4,15m' },
      { label: 'Toilet', value: '' },
      { label: 'Total Usable Area', value: 'M²', type: 'header' },
      { label: 'Swimming pool', value: '26,55m' },
      { label: 'Porches', value: '28,00m' },
      { label: 'Garage', value: '28,80m' },
      { label: 'Built Surfaces', value: 'M²', type: 'header' },
      { label: '100% housing', value: '132,44m' },
      { label: 'Porch 50%', value: '14,01m' },
      { label: 'Built Home Surface', value: 'M²', type: 'header' },
      { label: 'Garage 50%', value: '14,40m' },
      { label: 'Total Plot Surface', value: '729,88m', type: 'total' },
    ],
  },
  {
    name: 'Villa Libella',
    description: 'Serenity, harmony, and elegance are the three defining traits of the Libella Villas. A home designed to connect with the environment and enjoy every moment. Includes walk-in closet, laundry room, and a covered garage of 31 m².',
    image: '/assets/images/Fachada jardin.webp',
    price: '509.960€',
    beds: '3', baths: '2 + 1 Guest', plot: '882 - 1,040 m²', build: '146 m²',
    gallery: [
      '/assets/images/Omala - Villa Libella/Bano-3-scaled.webp',
      '/assets/images/Omala - Villa Libella/Cocina-1-scaled.webp',
      '/assets/images/Omala - Villa Libella/Omala-Residences-Villa-Libella-001-2.webp',
      '/assets/images/Omala - Villa Libella/Omala-Residences-Villa-Libella-002-2.webp',
      '/assets/images/Omala - Villa Libella/Omala-Residences-Villa-Libella-003-2.webp',
      '/assets/images/Omala - Villa Libella/Omala-Residences-Villa-Libella-004-2.webp',
      '/assets/images/Omala - Villa Libella/omala-residences-villa-libella-dormitorio-1.webp',
      '/assets/images/Omala - Villa Libella/omala-residences-villa-libella-dormitorio-2.webp',
      '/assets/images/Omala - Villa Libella/omala-residences-villa-libella-fachada-jardin-nocturna.webp',
      '/assets/images/Omala - Villa Libella/omala-residences-villa-libella-fachada-jardin.webp',
      '/assets/images/Omala - Villa Libella/omala-residences-villa-libella-fachada.webp',
      '/assets/images/Omala - Villa Libella/omala-residences-villa-libella-lavanderia.webp',
      '/assets/images/Omala - Villa Libella/omala-residences-villa-libella-vestidor.webp',
    ],
    floorplanImage: '/assets/images/Plano-Libella-1200x1201.webp',
    pdfUrl: '/assets/Omala_MemoriaCalidades_Libella.pdf',
    areaData: [
      { label: 'Superficies útiles', value: 'M²', type: 'header' },
      { label: 'Living-Dining Room-Kitchen', value: '39,50m' },
      { label: 'Hall', value: '6,10m' },
      { label: 'Corridor', value: '4,10m' },
      { label: 'Bedroom 1', value: '15,15m' },
      { label: 'Bedroom 2', value: '9,75m' },
      { label: 'Bedroom 3', value: '9,75m' },
      { label: 'Bathroom 1', value: '4,55m' },
      { label: 'Bathroom 2', value: '6,00m' },
      { label: 'Laundry Room', value: '3,05m' },
      { label: 'Guest Toilet', value: '' },
      { label: 'Total Usable Area', value: 'M²', type: 'header' },
      { label: 'Pool', value: '30,80m' },
      { label: 'Porch', value: '32,90m' },
      { label: 'Garage', value: '31,20m' },
      { label: 'Built Surfaces', value: 'M²', type: 'header' },
      { label: 'Dwelling 100%', value: '130,00m' },
      { label: 'Porch 50%', value: '16,45m' },
      { label: 'Built Home Surface', value: 'M²', type: 'header' },
      { label: 'Garage 50%', value: '15,60m' },
      { label: 'Total Plot Surface', value: '913,20m', type: 'total' },
    ],
  },
  {
    name: 'Villa Antia',
    description: 'Villa Antia is not just a home: it is a symbol. Inspired by the enduring spirit of the ant, this villa embodies strength, harmony, and a mindful way of living.',
    image: '/assets/images/omala-residences-villa-antia-fachada-piscina-2.webp',
    price: '558.000€',
    beds: '4', baths: '3 + 1 Guest', plot: '820 - 870 m²', build: '197 m²',
    gallery: [
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-001.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-002.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-003.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-004.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-bano.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-fachada-piscina-2.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-fachada-piscina.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-porche-piscina.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-puerta-principal-2.webp',
      '/assets/images/Omala - Villa Antia/omala-residences-villa-antia-puerta-principal.webp',
    ],
    floorplanImage: '/assets/images/omala-residences-villa-antia-1200x848.webp',
    areaData: [
      { label: 'Superficies útiles', value: 'M²', type: 'header' },
      { label: 'Living-Dining Room-Kitchen', value: '55,50m' },
      { label: 'Bedroom 1', value: '15,05m' },
      { label: 'Bedroom 2', value: '10,30m' },
      { label: 'Bedroom 3', value: '9,60m' },
      { label: 'Bedroom 4', value: '9,60m' },
      { label: 'Bathroom 1', value: '7,85m' },
      { label: 'Bathroom 2', value: '5,05m' },
      { label: 'Bathroom 3', value: '3,10m' },
      { label: 'Laundry Room', value: '3,05m' },
      { label: 'Guest Toilet', value: '' },
      { label: 'Total Usable Area', value: 'M²', type: 'header' },
      { label: 'Porch', value: '30,40m' },
      { label: 'Garage', value: '30,90m' },
      { label: 'Built Areas 214,35M²', value: 'M²', type: 'header' },
      { label: 'Dwelling 100%', value: '178,80m' },
      { label: 'Porch 50%', value: '35,55m' },
      { label: 'Total Plot Surface', value: '700m²', type: 'total' },
    ],
  },
];

const alhamaVillas: SeedVilla[] = [
  {
    name: 'Alhama Apartments',
    description: 'The flats are built to the highest quality standards and are equipped with communal swimming pool, terrace with summer kitchen and car park on the surface for each unit. The dwellings are distributed over 4 floors, with 2 or 3 bedrooms and 2 bathrooms.',
    image: '/assets/images/Alhama - Apartments/Apartamentos Frontal AN.webp',
    price: '208.425€',
    beds: '2 - 3', baths: '2', plot: 'N/A', build: '78 - 104 m²',
    gallery: [
      '/assets/images/Alhama - Apartments/-1vpMgkw.webp',
      '/assets/images/Alhama - Apartments/Apartamentos Frontal AN.webp',
      '/assets/images/Alhama - Apartments/BALCON_PS.webp',
      '/assets/images/Alhama - Apartments/COCINA-PB_PS.webp',
      '/assets/images/Alhama - Apartments/EDIFICIOS-Y-BUNGALOWS_sin-logo-1.webp',
      '/assets/images/Alhama - Apartments/ENTERO_PS-1.webp',
      '/assets/images/Alhama - Apartments/OAPp5Ufw.webp',
      '/assets/images/Alhama - Apartments/RaZv7BDQ.webp',
      '/assets/images/Alhama - Apartments/Render aptos+bung..webp',
      '/assets/images/Alhama - Apartments/SFDyrTew.webp',
      '/assets/images/Alhama - Apartments/VkRrF5aA.webp',
      '/assets/images/Alhama - Apartments/WpseN8Yw.webp',
      '/assets/images/Alhama - Apartments/_cOnmyqA.webp',
      '/assets/images/Alhama - Apartments/porZGwnw.webp',
      '/assets/images/Alhama - Apartments/s6gU3lgw.webp',
      '/assets/images/Alhama - Apartments/uXzg3eVw.webp',
    ],
    floorplanImage: '/assets/images/P1_A-1536x1086.webp',
  },
  {
    name: 'Alhama Bungalows',
    description: 'Residencial Gaudí is a complex of 18 bungalows with 2 or 3 bedrooms and 2 bathrooms with communal swimming pools, gardens and parking areas. The ground floors have large gardens and the upper floors have spacious solariums.',
    image: '/assets/images/Alhama - Bungalows/K_2vZcSg.webp',
    price: '240.000€',
    beds: '2 - 3', baths: '2', plot: 'N/A', build: '76 - 100 m²',
    gallery: [
      '/assets/images/Alhama - Bungalows/BUNGALOWS-TIPO-B_PS.webp',
      '/assets/images/Alhama - Bungalows/EDIFICIOS-Y-BUNGALOWS_sin-logo-1.webp',
      '/assets/images/Alhama - Bungalows/KHacVXFQ.webp',
      '/assets/images/Alhama - Bungalows/K_2vZcSg.webp',
      '/assets/images/Alhama - Bungalows/MAiz09TQ.webp',
      '/assets/images/Alhama - Bungalows/Primer Linea delante.webp',
      '/assets/images/Alhama - Bungalows/Salon de dia.webp',
      '/assets/images/Alhama - Bungalows/d77opXLA.webp',
      '/assets/images/Alhama - Bungalows/qfv-Bgkw.webp',
    ],
    floorplanImage: '/assets/images/10-1536x1086.webp',
  },
  {
    name: 'Alhama Villas',
    description: 'Villas Atenea. Independent villas, with private pool, solarium and parking on the surface. The villas, built to the highest standards, are equipped with 2, 3 or 4 bedrooms and 2 or 3 bathrooms.',
    image: '/assets/images/Y0dR94RA.webp',
    price: '369.900€',
    beds: '2 - 4', baths: '2 - 3', plot: '223 - 362 m²', build: '100 - 104 m²',
    gallery: [
      '/assets/images/Alhama - Villas/3 DORMITORIOS_PS.webp',
      '/assets/images/Alhama - Villas/8hSpPjnw.webp',
      '/assets/images/Alhama - Villas/BANO_PS.webp',
      '/assets/images/Alhama - Villas/DORMITORIO_PS.webp',
      '/assets/images/Alhama - Villas/Exterior Villas.webp',
      '/assets/images/Alhama - Villas/SALON COCINA_PS.webp',
      '/assets/images/Alhama - Villas/SOLARIUM_PS.webp',
      '/assets/images/Alhama - Villas/bano2.webp',
    ],
    floorplanImage: '/assets/images/VILLA-7-1536x1087.webp',
  },
];

const corveraVillas: SeedVilla[] = [
  {
    name: 'Olea Residences',
    description: 'A sanctuary of peace and modern living. Built to high-quality specifications with aerothermal systems, photovoltaic installations, and private swimming pools.',
    image: '/assets/images/Corvera - Olea Villas/VILLAS OLEA_Terraza fachada pricnipal 4D.webp',
    price: '482.000€ - 565.000€',
    beds: '3 - 4', baths: '2', plot: '422 - 501 m²', build: '119.21 - 143.13 m²',
    gallery: [
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA-Bano.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_Comedor y cocina.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_Dormitorio principal.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_Terraza fachada pricnipal 4D.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_Terraza y pisicna 4D.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_Vista aerea 1.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_salon comedor.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_salon cristalera.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_salon vista terraza.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_terraza 3D.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_terraza 4D.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_terraza fachada frontal 3D.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_terraza y piscina 3D.webp',
      '/assets/images/Corvera - Olea Villas/VILLAS OLEA_vista aerea 2.webp',
    ],
    floorplanImage: '/assets/images/olea general plan.webp',
    areaData: [
      { label: 'Built Area', value: '119.21 - 143.13 m²', type: 'header' },
      { label: 'Plot Area', value: '422.10 - 501.95 m²' },
      { label: 'Garden', value: '136.16 - 165.79 m²' },
      { label: 'Terraces', value: '90.63 - 104.28 m²' },
      { label: 'Solarium', value: '54.66 - 78.18 m²' },
      { label: 'Completion', value: 'Sept. 2027', type: 'total' },
    ],
  },
  {
    name: 'Aneas Villas',
    description: '12 semi-detached villas designed for optimal comfort and style. Featuring high-quality finishes, aerothermal systems, and the option for a private swimming pool and personalized landscaping.',
    image: '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_vista lateral atardecer.webp',
    price: '369.000€ - 445.000€',
    beds: '3', baths: '3', plot: '249 - 401 m²', build: '115.35 - 117.47 m²',
    gallery: [
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS-frontal atardecer.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_Dormitorio invitados.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_Dormitorio principal.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_Terraza.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_bano 1.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_bano 2.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_cocina.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_salon.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_vista frontal exterior.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_vista lateral atardecer.webp',
      '/assets/images/Corvera - Aneas Villas/ANEAS VILLAS_vista lateral.webp',
      '/assets/images/Corvera - Aneas Villas/Aneas_aerea.webp',
    ],
    floorplanImage: '/assets/images/aneas villas.webp',
    areaData: [
      { label: 'Built Area', value: '115.35 - 117.47 m²', type: 'header' },
      { label: 'Plot Area', value: '249.70 - 401.78 m²' },
      { label: 'Garden', value: '88.87 - 148.27 m²' },
      { label: 'Terraces', value: '33.95 - 35.15 m²' },
      { label: 'Solarium', value: '46.74 - 47.54 m²' },
      { label: 'Completion', value: 'Nov. 2027', type: 'total' },
    ],
  },
  {
    name: 'Aneas Apartments',
    description: '56 exclusive apartments offering a perfect blend of luxury and convenience. Ground floors feature large terraces, while upper floors boast expansive solariums. All units include storage rooms and access to a 150 m² communal pool.',
    image: '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_Alzado bloque 1.webp',
    price: '229.000€ - 350.000€',
    beds: '2 - 3', baths: '2', plot: 'N/A', build: '73.68 - 103.29 m²',
    gallery: [
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_ terraza atardecer vidrio.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_Alzado bloque 1.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_Alzado bloque 2.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_Alzado bloque 3.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_Bano 2D.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_Bano 3D.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_Cocina 3D.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_Dormitorio 2 3D.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_general bloques.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_salon 3D.webp',
      '/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_terraza vista piscina.webp',
      '/assets/images/Corvera - Aneas Apartments/Aneas_aerea.webp',
    ],
    floorplanImage: '/assets/images/Aneas apartments plan.webp',
    areaData: [
      { label: 'Built Area', value: '73.68 - 103.29 m²', type: 'header' },
      { label: 'Terrace', value: '15.03 - 124.57 m²' },
      { label: 'Solarium (Top Floors)', value: '48.66 - 68.56 m²' },
      { label: 'Storage Room', value: '14.24 - 20.46 m²' },
      { label: 'Completion', value: 'Jan. 2028', type: 'total' },
    ],
  },
];

const resorts: { community: string; villas: SeedVilla[] }[] = [
  { community: 'Omala Residences', villas: omalaVillas },
  { community: 'Alhama Nature', villas: alhamaVillas },
  { community: 'Corvera Hills', villas: corveraVillas },
];

// Uploads each local asset once and reuses the result if the same file path
// appears more than once for a villa (e.g. the hero image also appears in
// the gallery).
async function uploadWithCache(localPath: string, cache: Map<string, string>): Promise<string> {
  const cached = cache.get(localPath);
  if (cached) return cached;
  const url = await uploadPublicAsset(localPath);
  cache.set(localPath, url);
  return url;
}

async function seedProperties() {
  await ensureMediaBucket();
  const uploadCache = new Map<string, string>();

  for (const { community, villas } of resorts) {
    for (const [index, villa] of villas.entries()) {
      console.log(`Uploading assets for ${villa.name}...`);
      const slug = slugify(villa.name);

      const featuredImage = await uploadWithCache(villa.image, uploadCache);
      const galleryUrls = await Promise.all(villa.gallery.map((img) => uploadWithCache(img, uploadCache)));
      const floorplanImage = villa.floorplanImage ? await uploadWithCache(villa.floorplanImage, uploadCache) : null;
      const pdfUrl = villa.pdfUrl ? await uploadWithCache(villa.pdfUrl, uploadCache) : null;

      await prisma.property.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          title: villa.name,
          description: villa.description,
          price: villa.price,
          status: 'AVAILABLE',
          bedrooms: villa.beds,
          bathrooms: villa.baths,
          area: villa.build,
          landArea: villa.plot,
          community,
          featuredImage,
          images: JSON.stringify(galleryUrls),
          floorplanImage,
          pdfUrl,
          areaData: villa.areaData ? JSON.stringify(villa.areaData) : null,
          isFeatured: index === 0,
          seoTitle: `${villa.name} | ${community} | Medsol Real Estate`,
          seoDescription: villa.description.slice(0, 155),
        },
      });
    }
  }
  console.log('Seeded properties for Omala, Alhama and Corvera.');
}

async function seedJournal() {
  const title = 'Why Murcia Is Becoming the Mediterranean’s Best-Kept Secret';
  const slug = slugify(title);
  const content = `For decades, buyers chasing the Mediterranean dream looked first to the Costa del Sol or the Balearics. Murcia stayed quietly in the background — golf courses, orchards, and a coastline that never quite made the glossy brochures. That is changing fast, and for good reason.

## A Climate That Works Year-Round

Murcia enjoys over 300 days of sunshine a year, with milder, drier summers than much of the southern coast. It is the kind of climate that rewards early risers on the golf course and long lunches on a shaded terrace in equal measure — a genuine four-season lifestyle rather than a July-and-August rush.

## Space, Without the Price Tag of Marbella

What sets communities like Omala Residences and Alhama Nature apart is scale: plot sizes that would be unthinkable further along the coast, at a fraction of the price per square metre. Buyers are discovering that the amplitude they once associated with far more expensive postcodes is available here, without compromising on architecture or finish quality.

## Golf, Nature, and a Genuine Community

Alhama Nature's Jack Nicklaus-designed course and the Sierra de Espuña on its doorstep give the region a rare combination: championship golf minutes from genuine hiking trails and protected mountain landscape. Corvera Hills, meanwhile, is drawing a growing international community who want more than a holiday home — they want a second life, built around the golf club, the local markets, and neighbours who become friends.

## Connectivity Is No Longer a Trade-Off

Murcia International Airport has transformed the calculus for international buyers. What used to mean a long transfer from Alicante or Almería is now a fifteen-minute drive from Omala Residences, with direct and connecting flights across Europe expanding every season.

## The Takeaway

Murcia is not a discount version of better-known Spanish coastlines — it is its own proposition: more space, a genuinely liveable climate, serious golf, and a community still forming rather than fully priced in. For buyers who got in early on the Costa del Sol two decades ago, this is starting to feel familiar.`;

  await prisma.blogPost.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      title,
      excerpt:
        'Space, sunshine, and championship golf at a fraction of the price of better-known coastlines — why international buyers are discovering Murcia.',
      content,
      category: 'Market Insights',
      readTime: calculateReadTime(content),
      publishedAt: new Date(),
    },
  });
  console.log('Seeded sample journal post.');
}

async function main() {
  // Change this password (and rotate it after first login) before deploying.
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Seeded Admin user:', user);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env before seeding properties - ' +
        'they are required to upload villa images/PDFs to Supabase Storage.'
    );
  }

  await seedProperties();
  await seedJournal();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
