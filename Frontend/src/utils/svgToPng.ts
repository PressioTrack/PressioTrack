export const svgToPng = (
    svgElement: SVGSVGElement,
    width = 800,
    height = 400
): Promise<string> => {
    return new Promise((resolve) => {
        const clone = svgElement.cloneNode(true) as SVGSVGElement;

        clone.querySelectorAll("[stroke]").forEach((el) => {
            const val = el.getAttribute("stroke");

            if (val && val.includes("var(")) {
                const cssVar = val.match(/var\((.*)\)/)?.[1]?.trim();

                if (cssVar) {
                    const realColor = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
                    if (realColor) el.setAttribute("stroke", realColor);
                }
            }
        });

        const svgData = new XMLSerializer().serializeToString(clone);

        const img = new Image();
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL("image/png"));
        };
    });
};
