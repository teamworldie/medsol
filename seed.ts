import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { slugify } from './src/lib/slug';

const prisma = new PrismaClient({});

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
  },
];

const resorts: { community: string; villas: SeedVilla[] }[] = [
  { community: 'Omala Residences', villas: omalaVillas },
  { community: 'Alhama Nature', villas: alhamaVillas },
  { community: 'Corvera Hills', villas: corveraVillas },
];

async function seedProperties() {
  for (const { community, villas } of resorts) {
    for (const [index, villa] of villas.entries()) {
      const slug = slugify(villa.name);
      const images = villa.floorplanImage ? [...villa.gallery, villa.floorplanImage] : villa.gallery;

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
          featuredImage: villa.image,
          images: JSON.stringify(images),
          isFeatured: index === 0,
          seoTitle: `${villa.name} | ${community} | Medsol Real Estate`,
          seoDescription: villa.description.slice(0, 155),
        },
      });
    }
  }
  console.log('Seeded properties for Omala, Alhama and Corvera.');
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

  await seedProperties();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
