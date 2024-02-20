import {Skeleton} from "@mui/material";

interface props{
    show:boolean;
}
const IndexPlaceHolder = ({show}:props) => {
    return (
        <>
            {show&&
                <div className={'grid grid-cols-1 md:grid-cols-3 gap-2'}>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                </div>
            }
        </>
    )
}

export default IndexPlaceHolder;