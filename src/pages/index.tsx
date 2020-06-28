import { pick } from "accept-language-parser";
import { GetServerSideProps, NextPage } from "next";
import React from "react";

import { defaultLanguage, supportedLanguages } from "../ui/shared/i18n";
type IndexPageProps = {};

const IndexPage: NextPage<IndexPageProps> = () => {
  return <div />;
};

export const getServerSideProps: GetServerSideProps<IndexPageProps> = async ({
  req,
  res,
}) => {
  const pickedLanguage = pick(
    supportedLanguages,
    req.headers["accept-language"] ?? "",
  );
  const query =
    pickedLanguage === defaultLanguage ? "" : `?l=${pickedLanguage}`;
  res.writeHead(302, { Location: `/vk${query}` });
  res.end();
  return { props: {} };
};

export default IndexPage;
