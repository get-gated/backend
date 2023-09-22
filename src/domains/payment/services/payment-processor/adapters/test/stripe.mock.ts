import { v4 as uuidv4 } from 'uuid';

export default function () {
  const charges = {};

  return {
    charges: {
      create: async function (charge: any) {
        const id = uuidv4();

        (charges as any)[id] = charge;

        return id;
      },
    },
  };
}
