import React from 'react'
import { useTranslations } from 'next-intl'
import ConsultationForm from '@/components/common/ConsultationForm'
import '@/styles/Consultation.css'

interface CTAProps {
  ctaData?: {
    title: string
    text: string
    button: string
  }
}

const CTA = ({ ctaData }: CTAProps) => {
  const t = useTranslations('cta');

  // Use API data if available, otherwise fall back to translations
  const title = ctaData?.title || t('title')
  const text = ctaData?.text || t('text')
  const button = ctaData?.button || t('button')

  return (
    <ConsultationForm
      title={title}
      text={text}
      button={button}
      showCitySpecific={false}
      salutationLabel={t('salutationLabel')}
      rezaBarghlameno={t('rezaBarghlameno')}
      primeLocalHomes={t('primeLocalHomes')}
      readyToBuyOrSell={t('readyToBuyOrSell')}
      name={t('name')}
      enterYourName={t('enterYourName')}
      phone={t('phone')}
      enterYourPhone={t('enterYourPhone')}
      email={t('email')}
      enterYourEmail={t('enterYourEmail')}
      message={t('message')}
      enterYourMessage={t('enterYourMessage')}
      sendMessage={t('sendMessage')}
      back={t('back')}
      sending={t('sending')}
    />
  )
}

export default CTA