import { Fade } from "@mui/material";
import LoadingWithLabel from "./LoadingWithLabel";

interface Props {
    content: React.ReactNode;
    loadingFlag: boolean;
}

const FadeInLoadingWithLabel = ({content, loadingFlag}: Props) => {
  return (
    <>
        {!loadingFlag && <LoadingWithLabel />}
        <Fade in={loadingFlag} appear={false}>
            <span>
                {content}
            </span>
        </Fade>
    </>
  )
}

export default FadeInLoadingWithLabel
