import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    style?:React.CSSProperties;
}

export default function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, style,...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={style}
            {...other}>
            {value === index && (
                <Box sx={{ p: 3,margin:'0px',padding:'8px',display:'flex' ,flexDirection:'column',flexGrow:'1',height:'calc(100% -10px)'}}>
                        {children}
                   
                </Box>
            )}
        </div>
    );
}
