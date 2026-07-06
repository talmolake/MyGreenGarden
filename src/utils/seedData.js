// src/utils/seedData.js
import {firestore, COLLECTIONS} from '../config/firebase';
import {collection, doc, getDoc, writeBatch, serverTimestamp} from 'firebase/firestore';

export const DEFAULT_PLANTS = [
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    type: 'vegetable',
    sunlight: 'full sun',
    difficulty: 'medium',
    watering: 'Keep soil consistently moist. Water every 2–3 days in hot weather.',
    soil: 'Fertile, well-draining loamy soil rich in compost. pH 6.0–7.0',
    pests: 'Aphids, whiteflies, fungal leaf spots',
    imageUrl: 'tomato',
    //imageUrl: 'https://i.imgur.com/LCCps95.jpg',
    description: 'Fast-growing vegetable producing vibrant red fruits. Needs support staking and consistent watering.',
  },
  {
    name: 'Cucumber',
    scientificName: 'Cucumis sativus',
    type: 'vegetable',
    sunlight: 'full sun',
    difficulty: 'medium',
    watering: 'Keep soil consistently moist. Water every 2 days; avoid drying out.',
    soil: 'Loose, well-draining soil rich in organic matter. pH 6.0–7.0',
    pests: 'Cucumber beetles, aphids, powdery mildew',
    imageUrl: 'cucumber',
    //imageUrl: 'https://i.imgur.com/R8UFnAz.jpg',
    description: 'Vining vegetable that produces crisp fruits. Needs a trellis for best results and healthy vine growth.',
  },
  {
    name: 'Mint',
    scientificName: 'Mentha spp.',
    type: 'herb',
    sunlight: 'partial shade',
    difficulty: 'easy',
    watering: 'Keep soil evenly moist. Water every 2–3 days during hot/dry periods.',
    soil: 'Moist, fertile, well-draining soil rich in organic matter. pH 6.0–7.5',
    pests: 'Aphids, spider mites, mint rust',
    imageUrl: 'mint',
    //imageUrl: 'https://i.imgur.com/JaF1fmB.jpg',
    description: 'Vigorous perennial herb. Best grown in containers to prevent spreading uncontrollably.',
  },
  {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    type: 'herb',
    sunlight: 'full sun',
    difficulty: 'easy',
    watering: 'Deeply but infrequently. Water every 2–3 weeks; let soil dry completely.',
    soil: 'Well-draining cactus or succulent mix. pH 7.0–8.5',
    pests: 'Mealybugs, scale insects, root rot',
    imageUrl: 'aloevera',
    //imageUrl: 'https://i.imgur.com/L6NDhp2.jpg',
    description: 'Succulent known for its medicinal gel. Drought tolerant and very low maintenance.',
  },
  {
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    type: 'flower',
    sunlight: 'partial shade',
    difficulty: 'easy',
    watering: 'Every 2–4 weeks; allow soil to dry completely between waterings.',
    soil: 'Well-draining sandy potting mix. pH 4.5–7.0',
    pests: 'Spider mites, mealybugs',
    imageUrl: 'snakeplant',
    //imageUrl: 'https://i.imgur.com/N8cOqjG.jpg',
    description: 'Architectural plant that is incredibly hardy. Excellent for air purification in homes.',
  },
  {
    name: 'Marigold',
    scientificName: 'Tagetes spp.',
    type: 'flower',
    sunlight: 'full sun',
    difficulty: 'easy',
    watering: 'Water every 5–7 days; allow soil to dry slightly between watering.',
    soil: 'Well-draining garden soil enriched with compost. pH 6.0–7.5',
    pests: 'Aphids, spider mites, whiteflies',
    imageUrl: 'marigold',
    //imageUrl: 'https://i.imgur.com/OcnUZSk.jpg',
    description: 'Hardy annual producing bright flowers. Often used to repel pests in vegetable gardens.',
  },
  {
    name: 'Petunia',
    scientificName: 'Petunia hybrida',
    type: 'flower',
    sunlight: 'full sun',
    difficulty: 'easy',
    watering: 'Water every 5–7 days; containers may need more frequent watering.',
    soil: 'Light, well-draining soil enriched with compost. pH 6.0–7.0',
    pests: 'Aphids, caterpillars, spider mites',
    imageUrl: 'petunia',
    //imageUrl: 'https://i.imgur.com/juxTbur.jpg',
    description: 'Popular ornamental plant known for colorful trumpet-shaped flowers. Avoid deep shade.',
  },
];

export const seedDefaultPlants = async () => {
 const metaRef = doc(firestore, '_meta', 'seed');
  const meta = await getDoc(metaRef);
  
  if (meta.exists() && meta.data()?.seeded) return;

  const batch = writeBatch(firestore);
  const plantsCol = collection(firestore, COLLECTIONS.PLANTS);

  DEFAULT_PLANTS.forEach(plant => {
    const ref = doc(plantsCol); 
    batch.set(ref, {
      ...plant,
      createdAt: serverTimestamp(),
      isUserAdded: false,
    });
  });

  batch.set(metaRef, { seeded: true, seededAt: serverTimestamp() });
  await batch.commit();
};
