import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { PageContentsForApp } from "../ui/PageContentsForApp";
import { PageMetadata } from "../ui/PageMetadata";
import { i18next } from "../ui/shared/i18n";

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
  return {
    props: {
      locale: `${context.query.l}`,
    },
  };
};

export default VkPage;
