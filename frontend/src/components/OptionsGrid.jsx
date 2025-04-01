import React from 'react';
import { useTranslation } from 'react-i18next';
import OptionCard from './OptionCard';

function OptionsGrid({ onApiResponse }) {
  const { t } = useTranslation();
  
  const options = [
    {
      title: t('options.client.title'),
      description: t('options.client.description'),
      buttonText: t('options.client.button'),
      path: '/client'
    },
    {
      title: t('options.admin.title'),
      description: t('options.admin.description'),
      buttonText: t('options.admin.button'),
      path: '/admin'
    },
    {
      title: t('options.staff.title'),
      description: t('options.staff.description'),
      buttonText: t('options.staff.button'),
      path: '/staff'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 relative before:content-[''] before:absolute before:w-full before:h-full before:bg-[linear-gradient(to_right,var(--tw-gradient-stops))] before:from-primary/5 before:via-transparent before:to-primary/5 before:bg-[length:40px_40px] before:-z-10 before:opacity-30">
      {options.map((option, index) => (
        <OptionCard 
          key={index}
          title={option.title}
          description={option.description}
          buttonText={option.buttonText}
          path={option.path}
          onApiResponse={onApiResponse}
        />
      ))}
    </div>
  );
}

export default OptionsGrid;
