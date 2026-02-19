import { useState, useEffect } from 'react';
import { Megaphone, Calendar, ArrowRight, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId } from '../utils/supabase/info';
import { useTheme } from './ThemeContext';

interface AnnouncementsProps {
  session: any;
  language: string;
}

export function Announcements({ session, language }: AnnouncementsProps) {
  const { theme } = useTheme();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/announcements`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Load announcements error:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Ministry of Agriculture Announcements',
      subtitle: 'Latest news, updates, and information for farmers',
      readMore: 'Read More',
      noAnnouncements: 'No announcements at this time',
      checkBack: 'Check back later for updates from the Ministry of Agriculture'
    },
    fr: {
      title: 'Annonces du Ministère de l\'Agriculture',
      subtitle: 'Dernières nouvelles, mises à jour et informations pour les agriculteurs',
      readMore: 'Lire la suite',
      noAnnouncements: 'Aucune annonce pour le moment',
      checkBack: 'Revenez plus tard pour les mises à jour du Ministère de l\'Agriculture'
    },
    rw: {
      title: 'Amatangazo ya Minisiteri y\'ubuhinzi',
      subtitle: 'Amakuru agezweho, ivugurura n\'amakuru ku bahinzi',
      readMore: 'Soma byinshi',
      noAnnouncements: 'Nta matangazo aha kuri ubu',
      checkBack: 'Subira hanyuma kugira ngo ubone ivugurura riva kuri Minisiteri y\'ubuhinzi'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Demo announcements with Rwandan farmer background
  const demoAnnouncements = [
    {
      id: 1,
      title: {
        en: 'New Fertilizer Subsidy Program Launched',
        fr: 'Nouveau programme de subvention d\'engrais lancé',
        rw: 'Gahunda nshya yo gutanga inkunga ku ifumbire yatangiye'
      },
      content: {
        en: 'The Ministry of Agriculture announces a new fertilizer subsidy program to support smallholder farmers. Eligible farmers can receive up to 50% subsidy on approved fertilizers.',
        fr: 'Le Ministère de l\'Agriculture annonce un nouveau programme de subvention d\'engrais pour soutenir les petits agriculteurs. Les agriculteurs éligibles peuvent recevoir jusqu\'à 50% de subvention sur les engrais approuvés.',
        rw: 'Minisiteri y\'Ubuhinzi itangaza gahunda nshya yo gutanga inkunga ku ifumbire kugira ngo ifashe abahinzi bafite imirima mito. Abahinzi bemerewe bashobora kubona inkunga igera ku 50% ku ifumbire yemewe.'
      },
      date: '2024-12-10',
      category: 'Subsidy',
      image: 'https://images.unsplash.com/photo-1551357176-67341c5b414f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyd2FuZGFuJTIwZmFybWVycyUyMGZpZWxkfGVufDF8fHx8MTc2NTUyMjI0M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      title: {
        en: 'Training on Modern Irrigation Techniques',
        fr: 'Formation sur les techniques d\'irrigation modernes',
        rw: 'Amahugurwa ku buhinga bugezweho bwo kuhira'
      },
      content: {
        en: 'Free training sessions on modern irrigation techniques will be conducted across all districts. Register through your local agricultural extension officer.',
        fr: 'Des sessions de formation gratuites sur les techniques d\'irrigation modernes seront organisées dans tous les districts. Inscrivez-vous auprès de votre agent de vulgarisation agricole local.',
        rw: 'Amahugurwa y\'ubuntu yerekeye uburyo bugezweho bwo kuhira azakorwa mu turere twose. Wandikishe ukoresheje umukozi w\'ubuhinzi wo mu karere kawe.'
      },
      date: '2024-12-08',
      category: 'Training',
      image: 'https://images.unsplash.com/photo-1740741703636-1680d0c0f0a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBmYXJtaW5nfGVufDF8fHx8MTc2NTUyMjI0NHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      title: {
        en: 'Pest Control Advisory for Coffee Farmers',
        fr: 'Conseil de lutte antiparasitaire pour les caféiculteurs',
        rw: 'Inama yo kurwanya ibyonnyi ku bahinzi b\'ikawa'
      },
      content: {
        en: 'Due to recent weather patterns, coffee farmers are advised to monitor for coffee berry disease. Contact extension officers for approved treatment methods.',
        fr: 'En raison des récentes conditions météorologiques, il est conseillé aux caféiculteurs de surveiller la maladie des baies de café. Contactez les agents de vulgarisation pour les méthodes de traitement approuvées.',
        rw: 'Kubera ibihe byikirere byagenze, abahinzi b\'ikawa basabwa gukurikirana indwara z\'imbuto z\'ikawa. Twandikire abakozi bo kwamamaza ubuhinzi kugira ngo ubone uburyo bwemewe bwo kuvura.'
      },
      date: '2024-12-05',
      category: 'Advisory',
      image: 'https://images.unsplash.com/photo-1675062022606-6352f2a972da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFybWVycyUyMHdvcmtpbmd8ZW58MXx8fHwxNzY1NTIyMjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
    {
      id: 4,
      title: {
        en: 'Market Access Program for Horticultural Producers',
        fr: 'Programme d\'accès au marché pour les producteurs horticoles',
        rw: 'Gahunda yo kubona amasoko ku bahinzi b\'imboga n\'imbuto'
      },
      content: {
        en: 'The Ministry has partnered with major retailers to create direct market access for horticultural farmers. Interested farmers should register through AgriConnect platform.',
        fr: 'Le Ministère s\'est associé à de grands détaillants pour créer un accès direct au marché pour les agriculteurs horticoles. Les agriculteurs intéressés doivent s\'inscrire via la plateforme AgriConnect.',
        rw: 'Minisiteri yafatanije n\'abacuruzi bakomeye kugira ngo itange uburyo burambuye bwo kubona amasoko ku bahinzi b\'imboga n\'imbuto. Abahinzi bashishikajwe basabwa kwiyandikisha binyuze kuri AgriConnect.'
      },
      date: '2024-12-03',
      category: 'Market Access',
      image: 'https://images.unsplash.com/photo-1756245994848-1eb2be3b9b63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyd2FuZGElMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NjU1MjIyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const displayAnnouncements = announcements.length > 0 ? announcements : demoAnnouncements;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-10 h-10 text-white" />
            <h1 className="text-3xl text-white">{t.title}</h1>
          </div>
          <p className="text-green-100 text-lg">{t.subtitle}</p>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {displayAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">{t.noAnnouncements}</h3>
            <p className="text-gray-500 dark:text-gray-500">{t.checkBack}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={announcement.image}
                    alt={announcement.title[language as keyof typeof announcement.title] || announcement.title.en}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      theme === 'dark' 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {announcement.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className={`text-xl mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {announcement.title[language as keyof typeof announcement.title] || announcement.title.en}
                  </h3>

                  <p className={`text-sm mb-4 line-clamp-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {announcement.content[language as keyof typeof announcement.content] || announcement.content.en}
                  </p>

                  <button className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:gap-3 transition-all">
                    {t.readMore}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
