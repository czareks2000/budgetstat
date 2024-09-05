import { Fade } from "@mui/material";
import LoadingCenter from "./LoadingCenter";

interface Props {
    content: React.ReactNode;
    loadingFlag: boolean;
}

const FadeInLoading = ({content, loadingFlag}: Props) => {
  return (
    <>
        {!loadingFlag && <LoadingCenter />}
        <Fade in={loadingFlag} appear={false}>
            <span>
                {content}
            </span>
        </Fade>
    </>
  )
}

export default FadeInLoading