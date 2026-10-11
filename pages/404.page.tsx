import { ErrorPageContents } from "../shared/error-page-contents";
import { PageMetadata } from "../shared/page-metadata";

export default function NotFoundPage() {
  const message = "page not found";

  return (
    <>
      <PageMetadata title={message} description="" />
      <ErrorPageContents statusCode={404} message={message} />
    </>
  );
}
