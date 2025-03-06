import { notFound } from "next/navigation";
import { allPages } from "contentlayer/generated";

import "@/styles/mdx.css";

import { Metadata } from "next";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slugAsParams,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const page = allPages.find((page) => page.slugAsParams === params.slug);
  if (!page) {
    return;
  }

  const { title, description } = page;

  return constructMetadata({
    title: `${title} – Skills4Life`,
    description: description,
  });
}

export default async function PagePage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const page = allPages.find((page) => page.slugAsParams === params.slug);

  if (!page) {
    notFound();
  }

  const images = await Promise.all(
    page.images.map(async (src: string) => ({
      src,
      blurDataURL: await getBlurDataURL(src),
    })),
  );

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-4xl lg:text-5xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-xl text-muted-foreground">{page.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <div className="prose dark:prose-invert">
        {params.slug === 'privacy' ? (
          <>
            <h2>Privacy Policy</h2>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>
              This Privacy Policy describes how Skills4Life ("we," "us," or "our") collects, uses, and protects your personal information.
            </p>
            <h3>Information We Collect</h3>
            <p>
              We collect information that you provide directly to us, including name, email address, and other account details necessary for service provision.
            </p>
            <h3>Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, then skibidi toilet.
            </p>
          </>
        ) : params.slug === 'terms' ? (
          <>
            <h2>Terms of Service</h2>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>
              By accessing and using Skills4Life, you agree to be bound by these Terms of Service.
            </p>
            <h3>User Responsibilities</h3>
            <p>
              Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.
            </p>
            <h3>Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
            </p>
          </>
        ) : null}
      </div>
    </article>
  );
}
