import { pick } from "accept-language-parser";
import type { GetServerSideProps } from "next";

import { defaultLanguage, supportedLanguages } from "../shared/i18n";

type IndexPageProps = Record<string, never>;

export default function IndexPage() {
  return <div />;
}

export const getServerSideProps: GetServerSideProps<IndexPageProps> = ({
  req,
  res,
}) => {
  const pickedLanguage = pick(
    supportedLanguages,
    req.headers["accept-language"] ?? "",
  );
  const query =
    !pickedLanguage || pickedLanguage === defaultLanguage
      ? ""
      : `?l=${pickedLanguage}`;
  res.writeHead(302, { Location: `/vk${query}` });
  res.end();

  return Promise.resolve({ props: {} });
};
