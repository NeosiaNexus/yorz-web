export const dynamic = 'force-dynamic';

import { downloadFileAction } from '@/actions/cloud-storage-file';
import prisma from '@/lib/prisma';

import TarifItem from './_components/TarifItem';

export default async function Tarifs(): Promise<React.JSX.Element> {
  const categories = await prisma.portfolioCategory.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
      mediaExample: true,
    },
  });

  return (
    <div className="flex flex-col gap-10">
      <p className="font-comodo bg-gradient-to-r from-[#A6FF00] to-[#EAFF00] bg-clip-text pb-20 text-center text-7xl font-normal text-transparent">
        tarifs
      </p>
      <div className="flex w-full flex-col items-center justify-center gap-20">
        {categories.length === 0 && (
          <p className="text-center text-2xl font-bold text-white">
            Aucune tarification disponible...
          </p>
        )}
        {categories.map(async category => {
          const mediaDownload = await downloadFileAction({
            bucket: category.mediaExample.bucket,
            path: category.mediaExample.path,
          });
          return (
            <TarifItem
              image={mediaDownload.data?.url ?? ''}
              title={category.title}
              description={category.description}
              underDescription={category.underDescription}
              price={category.price}
              colorVariant={
                category.colorVariant === 'green'
                  ? 'green'
                  : category.colorVariant === 'red'
                    ? 'red'
                    : 'blue'
              }
              key={category.id}
              reverse={category.order % 2 === 0}
            />
          );
        })}
        {/* <TarifItem
          image={images.TARIFS_ILLUSTRATION_LOGO}
          title="Illustration de Logo."
          description={"Illustration de logo, qui va définir l'axe graphique de votre marque..."}
          underDescription={'Offert avec un icône et une bannière. ( tiré du logo ).'}
          price="200€ à 300€"
          colorVariant="green"
        />
        <TarifItem
          image={images.TARIFS_ILLUSTRATION_ICON}
          title={"Illustrations d'icon."}
          description={"Illustration d'icon, qui va définir l'axe graphique de votre marque.."}
          underDescription={'Fournis avec fond transparent et cercle.'}
          price="200€ à 300€"
          colorVariant="red"
          reverse
        />
        <TarifItem
          image={images.TARIFS_UI_PIXELART}
          title={'UI - PixelArt.'}
          description="Réalisation d'interface personnalisé pour vos serveurs de jeu minecraft. Optimisé et exporté de manière à faciliter le travail de vos developpeurs."
          underDescription={
            'Possibilité de créer une base ( fond, boutons etc... ) pour créer vos GUI vous même.'
          }
          price="Sous devis "
          priceComplement="80€/gui minimum"
          colorVariant="blue"
        />
        <TarifItem
          image={images.TARIFS_3D_MODEL}
          title={'3D Model'}
          description="Envie de faire un serveur java ou moddé tout en implémantant vos propres mobs, items et cosmétiques ?"
          price="Sous devis"
          priceComplement="Commande de 50€ minimum"
          colorVariant="red"
          reverse
        />
        <TarifItem
          image={images.TARIFS_AFFICHES}
          title={'Affiches'}
          description="Affiches faite de A à Z par YorzDraw..."
          underDescription={'Création de base possible..'}
          price="Sous devis "
          priceComplement="Commande de 50€ Minimum"
          colorVariant="blue"
        />
        <TarifItem
          image={images.TARIFS_WEBSITE_DESIGN}
          title={'Website design.'}
          price="Sous devis"
          priceComplement="Commande de 100€ minimum"
          colorVariant="green"
          reverse
        />
        <TarifItem
          image={images.TARIFS_PDP}
          title={'Photo de Profil.'}
          description="Illustrations d'image, Idéal pour les profils des réseaux sociaux."
          price="50€ à 150€"
          colorVariant="red"
        />
        <TarifItem
          image={images.TARIFS_BANNER}
          title={'Banniere Reseaux.'}
          description={
            "Illustration d'une bannière pour les réseaux sociaux. Notamment utilisé pour Youtube"
          }
          price="180€ à 500€"
          colorVariant="blue"
          reverse
        />
        <TarifItem
          image={images.TARIFS_EMOTE}
          title={'Emotes.'}
          description="Envoie d'exprimer ce que vous ressentez ou intéragir avec votre communauté à travers des emotes personnalisé ?."
          price="25€/unité"
          colorVariant="green"
        />
        <TarifItem
          image={images.TARIFS_CHIBI}
          title={'Chibi'}
          description={
            'Illustration de votre personnage. Notamment utilisé dans les vidéos et les miniatures réseaux...'
          }
          price="25€ base personnage | 4€/Expression"
          colorVariant="red"
          reverse
        />
        <TarifItem
          image={images.TARIFS_WALLPAPER}
          title={'Wallpaper.'}
          description="Images de fond, qui est utilisable partout (site, affiches...)."
          price="100€ à 400€"
          colorVariant="blue"
        />
        <TarifItem
          image={images.TARIFS_MODDED}
          title={'Minecraft modded.'}
          price="Sous devis"
          priceComplement="Commande de 100€ minimum"
          colorVariant="green"
          reverse
        /> */}
      </div>
    </div>
  );
}
