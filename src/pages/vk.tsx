import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { PageContentsForApp } from "../ui/PageContentsForApp";
import { PageMetadata } from "../ui/PageMetadata";
import { i18next } from "../ui/shared/i18n";

// https://vk.com/faq11565
const parseVkLanguage = (language: unknown): string | undefined => {
  switch (language) {
    case "0":
    case "2":
      return "ru";
    case "1":
      return "uk";
    case "3":
      return "en";
    case "6":
      return "de";
  }

  return undefined;
};

interface VkPageProps {
  locale: string;
}

const VkPage: NextPage<VkPageProps> = ({ locale }) => {
  const i18n = React.useMemo(() => {
    const instance = i18next.cloneInstance({ lng: locale });

    return instance;
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <PageMetadata />
      <PageContentsForApp />
    </I18nextProvider>
  );
};

export const getServerSideProps: GetServerSideProps<VkPageProps> = async (
  context,
) => {
  const locale =
    parseVkLanguage(context.query.language) ??
    parseVkLanguage(context.query.parent_language) ??
    (typeof context.query.l === "string" ? context.query.l : undefined) ??
    "en";

  return {
    props: {
      locale,
    },
  };
};

export default VkPage;
