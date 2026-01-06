import { getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import PageHeader from '@/components/layout/PageHeader';
import KomponentyContent from './KomponentyContent';
import { ComponentsPageHeader } from '@/types/strapi';

interface KomponentyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function KomponentyPage({ params }: KomponentyPageProps) {
  const { locale } = await params;
  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/komponenty/`;

  // Mock PageHeader data for demo
  const mockHeader: ComponentsPageHeader = {
    id: 1,
    slider: {
      id: 1,
      __component: 'components.slider',
      slides: [
        {
          id: 1,
          title: 'Knihovna komponent',
          description: 'Přehled všech dostupných komponent pro tvorbu obsahu',
          image: null,
          background_image: null,
          link: null,
          image_position: 'right',
          text_position: 'middle',
        },
      ],
      autoplay: false,
      autoplay_interval: null,
    },
    service_cards: {
      id: 1,
      __component: 'components.service-cards',
      cards: [
        { id: 1, icon: null, title: 'Interaktivní', description: 'Tlačítka, formuláře a rozbalovací sekce', link: null },
        { id: 2, icon: null, title: 'Obsah', description: 'Karty, dokumenty, videa a aktuality', link: null },
        { id: 3, icon: null, title: 'Marketing', description: 'Slidery, galerie a časové osy', link: null },
      ],
      columns: 'Three columns',
      text_align: null,
      card_clickable: null,
    },
  };

  return (
    <>
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      <div
        style={{
          background: `
            linear-gradient(to bottom, transparent, #FFF 100vh),
            linear-gradient(to right, #E7EFF7, #F8F2FD)
          `,
        }}
      >
        {/* PageHeader demo */}
        <PageHeader header={mockHeader} locale={locale} />

        <KomponentyContent />
      </div>
    </>
  );
}
