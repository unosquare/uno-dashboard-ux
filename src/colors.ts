export const colorValues = [
    'slate', // fill-slate-500 dark:fill-slate-500 bg-slate-500 dark:bg-slate-500 stroke-slate-500 dark:stroke-slate-500
    'gray', // fill-gray-500 dark:fill-gray-500 bg-gray-500 dark:bg-gray-500 stroke-gray-500 dark:stroke-gray-500
    'zinc', // fill-zinc-500 dark:fill-zinc-500 bg-zinc-500 dark:bg-zinc-500 stroke-zinc-500 dark:stroke-zinc-500
    'neutral', // fill-neutral-500 dark:fill-neutral-500 bg-neutral-500 dark:bg-neutral-500 stroke-neutral-500 dark:stroke-neutral-500
    'stone', // fill-stone-500 dark:fill-stone-500 bg-stone-500 dark:bg-stone-500 stroke-stone-500 dark:stroke-stone-500
    'red', // fill-red-500 dark:fill-red-500 bg-red-500 dark:bg-red-500 stroke-red-500 dark:stroke-red-500
    'orange', // fill-orange-500 dark:fill-orange-500 bg-orange-500 dark:bg-orange-500 stroke-orange-500 dark:stroke-orange-500
    'amber', // fill-amber-500 dark:fill-amber-500 bg-amber-500 dark:bg-amber-500 stroke-amber-500 dark:stroke-amber-500
    'yellow', // fill-yellow-500 dark:fill-yellow-500 bg-yellow-500 dark:bg-yellow-500 stroke-yellow-500 dark:stroke-yellow-500
    'lime', // fill-lime-500 dark:fill-lime-500 bg-lime-500 dark:bg-lime-500 stroke-lime-500 dark:stroke-lime-500
    'green', // fill-green-500 dark:fill-green-500 bg-green-500 dark:bg-green-500 stroke-green-500 dark:stroke-green-500
    'emerald', // fill-emerald-500 dark:fill-emerald-500 bg-emerald-500 dark:bg-emerald-500 stroke-emerald-500 dark:stroke-emerald-500
    'teal', // fill-teal-500 dark:fill-teal-500 bg-teal-500 dark:bg-teal-500 stroke-teal-500 dark:stroke-teal-500
    'cyan', // fill-cyan-500 dark:fill-cyan-500 bg-cyan-500 dark:bg-cyan-500 stroke-cyan-500 dark:stroke-cyan-500
    'sky', // fill-sky-500 dark:fill-sky-500 bg-sky-500 dark:bg-sky-500 stroke-sky-500 dark:stroke-sky-500
    'blue', // fill-blue-500 dark:fill-blue-500 bg-blue-500 dark:bg-blue-500 stroke-blue-500 dark:stroke-blue-500
    'indigo', // fill-indigo-500 dark:fill-indigo-500 bg-indigo-500 dark:bg-indigo-500 stroke-indigo-500 dark:stroke-indigo-500
    'violet', // fill-violet-500 dark:fill-violet-500 bg-violet-500 dark:bg-violet-500 stroke-violet-500 dark:stroke-violet-500
    'purple', // fill-purple-500 dark:fill-purple-500 bg-purple-500 dark:bg-purple-500 stroke-purple-500 dark:stroke-purple-500
    'fuchsia', // fill-fuchsia-500 dark:fill-fuchsia-500 bg-fuchsia-500 dark:bg-fuchsia-500 stroke-fuchsia-500 dark:stroke-fuchsia-500
    'pink', // fill-pink-500 dark:fill-pink-500 bg-pink-500 dark:bg-pink-500 stroke-pink-500 dark:stroke-pink-500
    'rose', // fill-rose-500 dark:fill-rose-500 bg-rose-500 dark:bg-rose-500 stroke-rose-500 dark:stroke-rose-500
] as const;

export type Color = (typeof colorValues)[number];
