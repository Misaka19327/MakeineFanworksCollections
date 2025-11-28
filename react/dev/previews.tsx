import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import {LoginPage} from "@/pages/LoginPage.tsx";

interface ComponentPreviewsProps {
    onBack: () => void
}

const ComponentPreviews = ({onBack}: ComponentPreviewsProps) => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/LoginPage">
                <LoginPage onBack={onBack}/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;