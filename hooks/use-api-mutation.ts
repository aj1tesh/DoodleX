import { useState } from "react";
import { useMutation } from "convex/react";
import { FunctionReference, OptionalRestArgs } from "convex/server";

export const useApiMutation = <T extends FunctionReference<"mutation">>(
    mutationFunction: T
) => {
    const [pending, setPending] = useState(false);
    const apiMutation = useMutation(mutationFunction);

    const mutate = (...args: OptionalRestArgs<T>) => {
        setPending(true);
        return apiMutation(...args)
            .finally(() => setPending(false))
            .then((result) => result)
            .catch((error) => { throw error; });
    };

    return { pending, mutate };
};