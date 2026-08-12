type SoundItem = {
    name: string;
    src: string;
};
export declare function useSoundLibrary(): {
    sounds: SoundItem[];
    loading: boolean;
    addIfExists: (filename: string) => Promise<boolean>;
    reload: () => Promise<void>;
};
export {};
//# sourceMappingURL=useSoundLibrary.d.ts.map