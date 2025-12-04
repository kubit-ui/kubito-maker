import { memo } from "react";
import { useSelectedBodyId, useEditorActions } from "@/store/editorStore";
import { bodies } from "@/data";

export const BodySelector = memo(() => {
  const selectedBodyId = useSelectedBodyId();
  const { setSelectedBodyId } = useEditorActions();

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Body:
          </span>
          <div className="flex gap-2">
            {bodies.map((body) => (
              <button
                key={body.id}
                onClick={() => setSelectedBodyId(body.id)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${
                    selectedBodyId === body.id
                      ? "bg-kubito-primary text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
                title={body.name}
              >
                {body.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

BodySelector.displayName = "BodySelector";
