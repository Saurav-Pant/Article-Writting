import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

const reviews = [
    {
        name: "Ravi Kumar",
        username: "@ravi",
        body: "This article writer is incredibly intuitive and easy to use. Highly recommend!",
        img: "https://avatar.vercel.sh/ravi",
    },
    {
        name: "John Smith",
        username: "@john",
        body: "A game-changer for my writing process. The minimalistic design is perfect.",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Priya Sharma",
        username: "@priya",
        body: "I've tried many writing tools, but this one stands out for its simplicity and efficiency.",
        img: "https://avatar.vercel.sh/priya",
    },
    {
        name: "Michael Johnson",
        username: "@michael",
        body: "The best tool for writers who want to focus on their content without distractions.",
        img: "https://avatar.vercel.sh/michael",
    },
    {
        name: "Anjali Patel",
        username: "@anjali",
        body: "I love how this tool helps me stay organized and productive. A must-have for writers.",
        img: "https://avatar.vercel.sh/anjali",
    },
    {
        name: "David Brown",
        username: "@david",
        body: "Simple, effective, and powerful. This article writer has everything I need.",
        img: "https://avatar.vercel.sh/david",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-72 cursor-pointer overflow-hidden rounded-xl border p-4",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm dark:text-white">{body}</blockquote>
        </figure>
    );
};

export function MarqueeDemo({className}: {className?: string}) {
    return (
        <div className="relative flex h-[500px] flex-col items-center justify-center overflow-hidden rounded-lg  bg-black md:shadow-xl mt-10 mx-auto w-[65vw]">
            <Marquee pauseOnHover className="[--duration:20s]">
                {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black"></div>
        </div>
    );
}
