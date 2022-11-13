import { GetServerSideProps, NextPage } from "next";
import * as React from "react";
import { I18nextProvider } from "react-i18next";
import styled from "styled-components";

import { App } from "../shared/graph-plotter";
import { i18next } from "../shared/i18n";
import { PageMetadata } from "../shared/page-metadata";

// https://vk.com/faq11565
const parseVkLanguage = (language: unknown): string | undefined => {
  switch (language) {
    case "0":
    case "2": {
      return "ru";
    }
    case "1": {
      return "uk";
    }
    case "3": {
      return "en";
    }
    case "6": {
      return "de";
    }
  }

  return undefined;
};

interface VkPageProps {
  locale: string;
}

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const VkPage: NextPage<VkPageProps> = ({ locale }) => {
  const i18n = React.useMemo(() => {
    const instance = i18next.cloneInstance({ lng: locale });

    return instance;
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <PageMetadata />
      <Wrapper>
        <App width={755} height={570} />
      </Wrapper>
    </I18nextProvider>
  );
};

export const getServerSideProps: GetServerSideProps<VkPageProps> = async (
  context,
  // eslint-disable-next-line @typescript-eslint/require-await
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
