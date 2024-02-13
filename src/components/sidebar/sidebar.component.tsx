
import React, { useState, useEffect } from 'react';
import { PRIMARY_COLOR, PRIMARY_COLOR_HIGHLIGHT } from '../../theme';
import { useNavigate } from 'react-router-dom';
import YesNoDialog from '../../components/yes-no-dialog/yes-no-dialog.component';
import '../sidebar/sidebar.style.css';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PaidIcon from '@mui/icons-material/Paid';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TuneIcon from '@mui/icons-material/Tune';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NavListItem from '../nav-list-item/nav-list-item';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ListAltIcon from '@mui/icons-material/ListAlt';
import UserModel from '@/src/models/user.model';
import UserService from '@/src/services/user.service';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} TransitionProps={{ timeout: 250 }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    top: '-18px',
    left: '-165px',
    position: 'absolute',
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    width: 'max-content',
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));


const Sidebar: React.FC = () => {

  const [sidebarOpen, setSidebarOpen] = useState<Boolean>(localStorage.getItem('sidebarOpen') === 'true');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>('');
  const [onHoverBool, setOnHoverBool] = useState(false);

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
    localStorage.setItem('sidebarOpen', String(!sidebarOpen));
  };

  const location = useLocation();
  const navigate = useNavigate();

  const initData = async () => {
    if (localStorage.getItem('isLogged') !== 'true') {
      navigate('/');
    } else {
      let type = localStorage.getItem('userType');
      setUserType(type ?? '');
    }
  }

  useEffect(() => {
    initData();
  }, [location]);



  return (

    <div style={{
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: sidebarOpen ? '220px' : '58px',
      whiteSpace: 'nowrap',
      transition: 'width 0.5s ease',
      backgroundColor: 'teal',
      borderRadius: '0px 8px 8px 0px'
    }}>
      <div style={{
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: sidebarOpen ? '220px' : '58px',
      whiteSpace: 'nowrap',
      transition: 'width 0.5s ease',
      backgroundColor: 'teal',
      borderRadius: '0px 8px 8px 0px'
    }}>
        <Button style={{
          display: 'block', position:
            'absolute', left: sidebarOpen ? '200px' : '38px',
          bottom: "16px",
          backgroundColor: 'white',
          width: '10px',
          minWidth: '10px',
          height: '40px',
          zIndex: '99',
          transition: 'all 0.5s ease',
        }}
          onClick={toggleDrawer}
          variant="contained">
          <ArrowBackIosNewIcon
            style={{
              width: '30px',
              left: '0px',
              top: '8px',
              position: 'absolute',
              color: PRIMARY_COLOR,
              transition: 'opacity 0.5s ease',
              opacity: sidebarOpen ? '1' : '0',
            }} />
          <ArrowForwardIosIcon
            style={{
              width: '30px',
              left: '0px',
              top: '8px',
              position: 'absolute',
              color: PRIMARY_COLOR,
              transition: 'opacity 0.5s ease',
              opacity: sidebarOpen ? '0' : '1',
            }} />
        </Button>
        <img src='/images/broker_logo_white.png'
          style={{
            margin: '4px 8px 16px 4px ',
            height: '50px',
            width: '50px',
            transition: 'opacity 0.5s ease',
            opacity: sidebarOpen ? '0' : '1',
          }} alt="" />
        <img src="/images/broker_title.png"
          height='60px'
          style={{
            margin: '0px 8px 16px 8px ',
            left: '0px',
            position: 'absolute',
            transition: 'opacity 0.5s ease',
            opacity: sidebarOpen ? '1' : '0',
          }} alt="" />
        <NavListItem
          name='Acceuil'
          route='/home'
          isOpen={sidebarOpen}
          icon={<HomeIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px', }} />}
        />
          <NavListItem
            name={userType === 'supervisor' ? 'Délégués' : 'Superviseurs/kam'}
            route='/delegate'
            isOpen={sidebarOpen}
            icon={<BusinessCenterIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />
        {
          userType !== 'operator' ? (<NavListItem
            name='Plan de tournée'
            route='/plan'
            isOpen={sidebarOpen}
            icon={<CalendarMonthIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />) : undefined
        }
        <NavListItem
            name='Tâches'
            route='/task'
            isOpen={sidebarOpen}
            icon={<ListAltIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />
        <NavListItem
            name='Rapports des visites'
            route='/report'
            isOpen={sidebarOpen}
            icon={<ReceiptIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />
        
        <NavListItem
          name='Bons de commandes'
          route='/command'
          isOpen={sidebarOpen}
          icon={<ShoppingCartIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        {
          userType !== 'operator' ? (<NavListItem
            name='Notes des frais'
            route='/expense'
            isOpen={sidebarOpen}
            icon={<PaidIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />) : undefined
        }
        <NavListItem
          name='Clients'
          route='/clients'
          isOpen={sidebarOpen}
          icon={<Diversity3Icon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        {
          userType !== 'operator' ? (<NavListItem
            name="Chiffre d'affaire"
            route='/revenue'
            isOpen={sidebarOpen}
            icon={<CreditCardIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />) : undefined
        }
        {
          userType !== 'operator' ? (<NavListItem
            name="Statistiques"
            route='/statistics'
            isOpen={sidebarOpen}
            icon={<InsertChartIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />) : undefined
        }
        <NavListItem
            name="Listes prédéfinies"
            route='/config'
            isOpen={sidebarOpen}
            icon={<TuneIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />
        {
          userType !== 'operator' ? (<NavListItem
            name="Profil"
            route='/profile'
            isOpen={sidebarOpen}
            icon={<AssignmentIndIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
          />) : undefined
        }
        <div style={{ display: 'flex', flex: '1', }}>

        </div>
        <Divider variant="middle" color='white' />
        <HtmlTooltip
          sx={{ display: sidebarOpen ? 'none' : 'block' }}
          title={
            <React.Fragment>
              <Typography color="inherit">Déconnecter</Typography>
            </React.Fragment>
          } placement='right'>

          <Button
            className='logout-btn'
            style={{
              marginTop: '8px',
              marginBottom:'60px',
              height: '45px',
              width: '220px',
              justifyContent: 'start',
              alignItems: 'center',
              color: 'white',
              textTransform: 'none',
              padding: '8px 0px 8px 16px',
              fontWeight: 'normal',
              backgroundColor: onHoverBool ? PRIMARY_COLOR_HIGHLIGHT : 'transparent',
            }}
            onClick={() => {
              setDialogOpen(true);
            }}
            onMouseEnter={() => {
              setOnHoverBool(true);
            }}
            onMouseLeave={() => {
              setOnHoverBool(false);
            }}
            variant="text">
            <LogoutIcon style={{ width: '30px', color: 'white', marginRight: '5px' }} />
            <div style={{
              opacity: sidebarOpen ? '1' : '0',
              transition: 'all 300ms ease'
            }}>
              Déconnecter
            </div>
          </Button>
        </HtmlTooltip>
        <YesNoDialog
          isOpen={dialogOpen}
          onNo={() => {
            setDialogOpen(false);
          }}
          onYes={() => {
            setDialogOpen(false);
            navigate('/');
            localStorage.clear();
          }}
          onClose={() => {
            setDialogOpen(false);
          }}
          message='Vous souhaitez vous déconnecter ??'></YesNoDialog>
      </div>
    </div>

  );
};

export default Sidebar;
