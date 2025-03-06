import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <MaxWidthWrapper>
        <section className="flex flex-col items-center">
          <div className="mx-auto flex w-full flex-col items-center gap-5">
          </div>

          <div className="grid w-full gap-5 bg-inherit py-5 lg:grid-cols-3">
          </div>


        </section>
      </MaxWidthWrapper>

      <hr className="container" />
    </div>
  );
}
