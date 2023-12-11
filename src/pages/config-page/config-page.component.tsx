import React, { Component } from 'react';
import '../config-page/config-page.style.css';
import { DotSpinner } from '@uiball/loaders';
import SpecialityModel from '../../models/speciality.model';
import SpecialityService from '../../services/speciality.service';
import Button from '@mui/material/Button/Button';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider/Divider';
import IconButton from '@mui/material/IconButton/IconButton';
import TextField from '@mui/material/TextField/TextField';
import Table from '@mui/material/Table/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import CommentService from '../../services/comment.service';
import MotivationService from '../../services/motivation.service';
import MotivationModel from '../../models/motivation.model';
import CommentModel from '../../models/comment.model';
import SupplierModel from '../../models/supplier.model';
import SupplierService from '../../services/supplier.service';
import WilayaModel from '../../models/wilaya.model';
import WilayaService from '../../services/wilaya.serivce';
import ExpenseService from '../../services/expense.service';
import ExpenseConfigModel from '../../models/expense-config.model';
import SaveIcon from '@mui/icons-material/Save';
import GoalModel from '../../models/goal.model';
import GoalService from '../../services/goal.service';
import ProductModel from '../../models/product.model';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ProductService from '../../services/product.service';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Snackbar from '@mui/material/Snackbar';
import YesNoDialog from '../../components/yes-no-dialog/yes-no-dialog.component';
import UserModel, { UserType } from '../../models/user.model';
import UserService from '../../services/user.service';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import RestoreIcon from '@mui/icons-material/Restore';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface ConfigPageProps {
    currentUser: UserModel;
    isLoading: boolean;
    specialityName: string;
    commentContent: string;
    motivationContent: string;
    loadingSpecialitiesData: boolean;
    medicalSpecialities: SpecialityModel[];
    draftedMedicalSpecialities: SpecialityModel[];
    loadingCommentsData: boolean;
    motivations: MotivationModel[];
    draftedMotivations: MotivationModel[];
    loadingMotivationsData: boolean;
    comments: CommentModel[];
    draftedComments: CommentModel[];
    supplier: SupplierModel;
    product: ProductModel;
    coproduct: ProductModel;
    suppliers: SupplierModel[];
    draftedSuppliers: SupplierModel[];
    products: ProductModel[];
    coproducts: ProductModel[];
    draftedProducts: ProductModel[];
    draftedCoProducts: ProductModel[];
    loadingSuppliersData: boolean;
    loadingProductsData: boolean;
    wilayas: WilayaModel[];
    goals: GoalModel[];
    selectedWilaya?: WilayaModel;
    expensesConfig: ExpenseConfigModel;
    showSnackbar: boolean;
    showDeleteSpecialityDialog: boolean;
    showRestoreSpecialityDialog: boolean;
    showDeleteCommentDialog: boolean;
    showRestoreCommentDialog: boolean;
    showDeleteMotivationDialog: boolean;
    showRestoreMotivationDialog: boolean;
    showDeleteSupplierDialog: boolean;
    showRestoreCoProductDialog: boolean;
    showRestoreSupplierDialog: boolean;
    showDeleteProductDialog: boolean;
    loadingCoProductsData: boolean;
    showRestoreProductDialog: boolean;
    showDeleteCoProductDialog: boolean;
    snackbarMessage: string;
    selectedSpecialityId: number;
    selectedCommentId: number;
    selectedMotivationId: number;
    selectedSupplierId: number;
    selectedProductId: number;
    selectedCoProductId: number;
    index: number;
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values: any) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                prefix="DA "
            />
        );
    },
);

class ConfigPage extends Component<{}, ConfigPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            isLoading: true,
            specialityName: '',
            commentContent: '',
            motivationContent: '',
            loadingSpecialitiesData: false,
            medicalSpecialities: [],
            draftedMedicalSpecialities: [],
            draftedProducts: [],
            draftedSuppliers: [],
            loadingCommentsData: false,
            comments: [],
            draftedComments: [],
            draftedMotivations: [],
            loadingMotivationsData: false,
            motivations: [],
            supplier: new SupplierModel({}),
            product: new ProductModel({}),
            coproduct: new ProductModel({}),
            suppliers: [],
            loadingSuppliersData: false,
            loadingProductsData: false,
            loadingCoProductsData: false,
            wilayas: [],
            products: [],
            coproducts: [],
            draftedCoProducts: [],
            expensesConfig: new ExpenseConfigModel({}),
            goals: [],
            showSnackbar: false,
            showDeleteSpecialityDialog: false,
            showRestoreSpecialityDialog: false,
            showDeleteCoProductDialog: false,
            showDeleteCommentDialog: false,
            showRestoreCommentDialog: false,
            showDeleteMotivationDialog: false,
            showRestoreMotivationDialog: false,
            showDeleteSupplierDialog: false,
            showRestoreProductDialog: false,
            showRestoreCoProductDialog: false,
            showRestoreSupplierDialog: false,
            showDeleteProductDialog: false,
            snackbarMessage: '',
            selectedCommentId: 0,
            selectedMotivationId: 0,
            selectedSupplierId: 0,
            selectedSpecialityId: 0,
            selectedProductId: 0,
            selectedCoProductId: 0,
            index: 0,
        }
    }

    specialityService = new SpecialityService();
    commentService = new CommentService();
    motivationService = new MotivationService();
    supplierService = new SupplierService();
    wilayaService = new WilayaService();
    expenseService = new ExpenseService();
    goalService = new GoalService();
    userService = new UserService();
    productService = new ProductService();

    loadConfigPageData = async () => {


        var specialities = await this.specialityService.getAllMedicalSpecialities();
        var draftedSpecialities = await this.specialityService.getAllDraftedMedicalSpecialities();
        var comments = await this.commentService.getAllComments();
        var draftedComments = await this.commentService.getDraftedComments();
        var motivations = await this.motivationService.getAllMotivations();
        var draftedMotivations = await this.motivationService.getAllDraftedMotivations();
        var suppliers = await this.supplierService.getAllSuppliers();
        var draftedSuppliers = await this.supplierService.getAllDraftedSuppliers();
        var wilayas = await this.wilayaService.getAllWilayas();
        var expensesConfig = await this.expenseService.getExpensesConfig();
        var currentUser = await this.userService.getMe();
        var goals = await this.goalService.getAllGoalsOfUserByDateMoth(new Date(), currentUser.id!);
        var products = await this.productService.getAllProducts();
        var draftedProducts = await this.productService.getAllDraftedProducts();
        var coproducts = await this.productService.getAllCoProducts();
        var draftedCoProducts = await this.productService.getAllDraftedCoProducts();
        if (!expensesConfig) {
            expensesConfig = await this.expenseService.createExpensesConfig();
        }
        this.setState({
            currentUser: currentUser,
            isLoading: false,
            medicalSpecialities: specialities,
            draftedComments: draftedComments,
            draftedMotivations: draftedMotivations,
            draftedMedicalSpecialities: draftedSpecialities,
            draftedProducts: draftedProducts,
            draftedSuppliers: draftedSuppliers,
            motivations: motivations,
            comments: comments,
            suppliers: suppliers,
            wilayas: wilayas,
            expensesConfig: expensesConfig!,
            goals: goals,
            products: products,
            coproducts: coproducts,
            draftedCoProducts: draftedCoProducts,
        });

    }

    handleRemoveSpeciality = async () => {
        this.setState({ loadingSpecialitiesData: true, showDeleteSpecialityDialog: false });
        await this.specialityService.draftMedicalSpeciality(this.state.selectedSpecialityId);
        var specialities = await this.specialityService.getAllMedicalSpecialities();
        var draftedSpecialities = await this.specialityService.getAllDraftedMedicalSpecialities();
        this.setState({ loadingSpecialitiesData: false, medicalSpecialities: specialities, draftedMedicalSpecialities: draftedSpecialities });
        this.setState({ showSnackbar: true, snackbarMessage: 'Spécialité supprimé' });
    }

    handleRestoreSpeciality = async () => {
        this.setState({ loadingSpecialitiesData: true, showRestoreSpecialityDialog: false });
        await this.specialityService.publishMedicalSpeciality(this.state.selectedSpecialityId);
        var specialities = await this.specialityService.getAllMedicalSpecialities();
        var draftedSpecialities = await this.specialityService.getAllDraftedMedicalSpecialities();
        this.setState({ loadingSpecialitiesData: false, medicalSpecialities: specialities, draftedMedicalSpecialities: draftedSpecialities });
        this.setState({ showSnackbar: true, snackbarMessage: 'Spécialité restauré' });
    }

    handleCreateSpeciality = async () => {
        this.setState({ loadingSpecialitiesData: true });
        await this.specialityService.createMedicalSpeciality(this.state.specialityName);
        var specialities = await this.specialityService.getAllMedicalSpecialities();
        this.setState({ loadingSpecialitiesData: false, medicalSpecialities: specialities, specialityName: '' });
        this.setState({ showSnackbar: true, snackbarMessage: 'Spécialité créé' });
    }

    handleSpecialityNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ specialityName: event.target.value });
    }

    handleRemoveComment = async () => {
        this.setState({ loadingCommentsData: true, showDeleteCommentDialog: false });
        await this.commentService.draftComment(this.state.selectedCommentId);
        var comments = await this.commentService.getAllComments();
        var draftedComments = await this.commentService.getDraftedComments();
        this.setState({ loadingCommentsData: false, comments: comments, draftedComments: draftedComments });
        this.setState({ showSnackbar: true, snackbarMessage: 'Commentaire supprimé' });
    }

    handleRestoreComment = async () => {
        this.setState({ loadingCommentsData: true, showRestoreCommentDialog: false });
        if (this.state.comments.length < 5) {
            await this.commentService.publishComment(this.state.selectedCommentId);
            var comments = await this.commentService.getAllComments();
            var draftedComments = await this.commentService.getDraftedComments();
            this.setState({ loadingCommentsData: false, comments: comments, draftedComments: draftedComments });
            this.setState({ showSnackbar: true, snackbarMessage: 'Commentaire restauré' });
        } else {
            var comments = await this.commentService.getAllComments();
            var draftedComments = await this.commentService.getDraftedComments();
            this.setState({ loadingCommentsData: false, comments: comments, draftedComments: draftedComments });
            this.setState({ showSnackbar: true, snackbarMessage: 'Nombre de commentaires dépassés, veuillez supprimer un commentaire puis réessayer' });
        }
    }

    handleCreateComment = async () => {
        this.setState({ loadingCommentsData: true });
        await this.commentService.createComment(this.state.commentContent);
        var comments = await this.commentService.getAllComments();
        this.setState({ loadingCommentsData: false, comments: comments, commentContent: '' });
        this.setState({ showSnackbar: true, snackbarMessage: 'Commentaire créé' });
    }

    handleCommentContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ commentContent: event.target.value });
    }

    handleRemoveMotivation = async () => {
        this.setState({ loadingMotivationsData: true, showDeleteMotivationDialog: false });
        await this.motivationService.draftMotivation(this.state.selectedMotivationId);
        var motivations = await this.motivationService.getAllMotivations();
        var draftedMotivations = await this.motivationService.getAllDraftedMotivations();
        this.setState({ loadingMotivationsData: false, motivations: motivations, draftedMotivations: draftedMotivations });
        this.setState({ showSnackbar: true, snackbarMessage: 'Motivation supprimé' });
    }

    handleRestoreMotivation = async () => {
        this.setState({ loadingMotivationsData: true, showRestoreMotivationDialog: false });
        await this.motivationService.publishMotivation(this.state.selectedMotivationId);
        var motivations = await this.motivationService.getAllMotivations();
        var draftedMotivations = await this.motivationService.getAllDraftedMotivations();
        this.setState({ loadingMotivationsData: false, motivations: motivations, draftedMotivations: draftedMotivations });
        this.setState({ showSnackbar: true, snackbarMessage: 'Motivation restauré' });
    }

    handleCreateMotivation = async () => {
        this.setState({ loadingMotivationsData: true });
        await this.motivationService.createMotivation(this.state.motivationContent);
        var motivations = await this.motivationService.getAllMotivations();
        this.setState({ loadingMotivationsData: false, motivations: motivations, motivationContent: '' });
        this.setState({ showSnackbar: true, snackbarMessage: 'Motivation créé' });
    }

    handleMotivationContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ motivationContent: event.target.value });
    }

    handleCreateSupplier = async () => {
        this.setState({ loadingSuppliersData: true });
        await this.supplierService.createSupplier(this.state.supplier);
        var suppliers = await this.supplierService.getAllSuppliers();
        this.setState({ loadingSuppliersData: false, suppliers: suppliers, supplier: new SupplierModel({}) });
        this.setState({ showSnackbar: true, snackbarMessage: 'Fournisseur créé' });
    }

    handleCreateProduct = async () => {
        this.setState({ loadingProductsData: true });
        await this.productService.createProduct(this.state.product);
        var prodcts = await this.productService.getAllProducts();
        this.setState({ loadingProductsData: false, products: prodcts, product: new ProductModel({}) });
        this.setState({ showSnackbar: true, snackbarMessage: 'Produit créé' });
    }

    handleCreateCoProduct = async () => {
        this.setState({ loadingCoProductsData: true });
        await this.productService.createCoProduct(this.state.coproduct);
        var coprodcts = await this.productService.getAllCoProducts();
        this.setState({ loadingCoProductsData: false, coproducts: coprodcts, coproduct: new ProductModel({}) });
        this.setState({ showSnackbar: true, snackbarMessage: 'Produit concurrent créé' });
    }

    handleRemoveSupplier = async () => {
        this.setState({ loadingSuppliersData: true, showDeleteSupplierDialog: false });
        await this.supplierService.draftSupplier(this.state.selectedSupplierId);
        var suppliers = await this.supplierService.getAllSuppliers();
        var draftedSuppliers = await this.supplierService.getAllDraftedSuppliers();
        this.setState({ loadingSuppliersData: false, suppliers: suppliers, draftedSuppliers: draftedSuppliers });
        this.setState({ showSnackbar: true, snackbarMessage: 'Fournisseur supprimé' });
    }

    handleRestoreSupplier = async () => {
        this.setState({ loadingSuppliersData: true, showRestoreSupplierDialog: false });
        await this.supplierService.publishSupplier(this.state.selectedSupplierId);
        var suppliers = await this.supplierService.getAllSuppliers();
        var draftedSuppliers = await this.supplierService.getAllDraftedSuppliers();
        this.setState({ loadingSuppliersData: false, suppliers: suppliers, draftedSuppliers: draftedSuppliers });
        this.setState({ showSnackbar: true, snackbarMessage: 'Fournisseur restauré' });
    }

    handleRemoveProduct = async () => {
        this.setState({ loadingProductsData: true, showDeleteProductDialog: false });
        await this.productService.draftProduct(this.state.selectedProductId);
        var products = await this.productService.getAllProducts();
        var draftedProducts = await this.productService.getAllDraftedProducts();
        this.setState({ loadingProductsData: false, products: products, draftedProducts: draftedProducts });
        this.setState({ showSnackbar: true, snackbarMessage: 'Produit supprimé' });
    }

    handleRemoveCoProduct = async () => {
        this.setState({ loadingCoProductsData: true, showDeleteCoProductDialog: false });
        await this.productService.draftCoProduct(this.state.selectedCoProductId);
        var coproducts = await this.productService.getAllCoProducts();
        var draftedCoProducts = await this.productService.getAllDraftedCoProducts();
        this.setState({ loadingCoProductsData: false, coproducts: coproducts, draftedCoProducts: draftedCoProducts });
        this.setState({ showSnackbar: true, snackbarMessage: 'Produit concurrent supprimé' });
    }

    handleRestoreProduct = async () => {
        this.setState({ loadingProductsData: true, showRestoreProductDialog: false });
        await this.productService.publishProduct(this.state.selectedProductId);
        var products = await this.productService.getAllProducts();
        var draftedProducts = await this.productService.getAllDraftedProducts();
        this.setState({ loadingProductsData: false, products: products, draftedProducts: draftedProducts });
        this.setState({ showSnackbar: true, snackbarMessage: 'Produit restauré' });
    }
    handleRestoreCoProduct = async () => {
        this.setState({ loadingCoProductsData: true, showRestoreCoProductDialog: false });
        await this.productService.publishCoProduct(this.state.selectedCoProductId);
        var coproducts = await this.productService.getAllCoProducts();
        var draftedCoProducts = await this.productService.getAllDraftedCoProducts();
        this.setState({ loadingCoProductsData: false, coproducts: coproducts, draftedCoProducts: draftedCoProducts });
        this.setState({ showSnackbar: true, snackbarMessage: 'Produit concurrent restauré' });
    }

    handleSaveExpenseConfigChange = async () => {
        await this.expenseService.updateExpensesConfig(this.state.expensesConfig);
        this.setState({ showSnackbar: true, snackbarMessage: 'Modifications des chiffres d\'affaires enregistrées' });
    }

    handleSaveGoalsChange = async () => {
        for (var goal of this.state.goals) {
            await this.goalService.updateGoal(goal);
        }
        this.setState({ showSnackbar: true, snackbarMessage: 'Modifications d\'objectifs enregistrées' });
    }

    handleCloseSanckbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        this.setState({ showSnackbar: false });
    };

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue });
    };

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {
            this.loadConfigPageData();
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <DotSpinner
                        size={40}
                        speed={0.9}
                        color="black"
                    />
                </div>
            );
        }
        else {
            return (
                <div className='clients-pharmacy-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', backgroundColor: '#eee' }}>
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Configuration" />
                                <Tab label="Corbeille" />

                            </Tabs>
                        </Box>

                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)' }} value={this.state.index} index={0} >
                            <div className='config-container'>
                                <div style={{ display: 'flex', width: '100%', maxHeight: '450px', marginTop: '8px' }}>
                                    <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', width: '100%', padding: '8px 8px 0px 8px' }}>
                                            <TextField value={this.state.specialityName} onChange={this.handleSpecialityNameChange} size="small" id="outlined-basic" label="Nom de spécialité" variant="outlined" sx={{ marginRight: '8px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                            <IconButton onClick={() => this.handleCreateSpeciality()} sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        <div style={{ display: 'flex', flexGrow: '1', padding: '8px 8px 0px 16px', marginBottom: '8px', maxHeight: '392px' }}>
                                            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                                <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                    <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                        <TableCell sx={{ width: '100%' }} align="left">Nom de spécialité </TableCell>
                                                        <TableCell sx={{ width: '100%' }} align="right">Supprimer</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                    {
                                                        this.state.loadingSpecialitiesData ? (<div style={{
                                                            width: '100%',
                                                            flexGrow: '1',
                                                            overflow: 'hidden',
                                                            height: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <DotSpinner
                                                                size={40}
                                                                speed={0.9}
                                                                color="black"
                                                            />
                                                        </div>) :
                                                            this.state.medicalSpecialities.map((row) => (
                                                                <TableRow
                                                                    key={row.id}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell sx={{ width: '100%' }} align="left">{row.name}</TableCell>
                                                                    <TableCell sx={{ width: '100%', padding: '0px 16px 0px 0px' }} align="right">
                                                                        <IconButton onClick={() => {
                                                                            this.setState({ showDeleteSpecialityDialog: true, selectedSpecialityId: row.id! });
                                                                        }} >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid grey 1px' }} />
                                    <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', width: '100%', padding: '8px 8px 0px 8px' }}>
                                            <TextField disabled={this.state.comments.length === 5} value={this.state.commentContent} onChange={this.handleCommentContentChange} size="small" id="outlined-basic" label="Contenu du commentaire" variant="outlined" sx={{ marginRight: '8px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                            <IconButton disabled={this.state.comments.length === 5} onClick={() => this.handleCreateComment()} sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        <div style={{ display: 'flex', flexGrow: '1', padding: '8px 8px 0px 16px', marginBottom: '8px', maxHeight: '392px' }}>
                                            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                                <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                    <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                        <TableCell sx={{ width: '100%' }} align="left">Contenu du commentaire</TableCell>
                                                        <TableCell sx={{ width: '100%' }} align="right">Supprimer</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                    {
                                                        this.state.loadingCommentsData ? (<div style={{
                                                            width: '100%',
                                                            flexGrow: '1',
                                                            overflow: 'hidden',
                                                            height: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <DotSpinner
                                                                size={40}
                                                                speed={0.9}
                                                                color="black"
                                                            />
                                                        </div>) :
                                                            this.state.comments.map((row) => (
                                                                <TableRow
                                                                    key={row.id}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell sx={{ width: '100%' }} align="left">{row.comment}</TableCell>
                                                                    <TableCell sx={{ width: '100%', padding: '0px 16px 0px 0px' }} align="right">
                                                                        <IconButton onClick={() => {
                                                                            this.setState({ showDeleteCommentDialog: true, selectedCommentId: row.id! });
                                                                        }}>
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid grey 1px' }} />
                                    <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', width: '100%', padding: '8px 8px 0px 8px' }}>
                                            <TextField value={this.state.motivationContent} onChange={this.handleMotivationContentChange} size="small" id="outlined-basic" label="Nom de motivation" variant="outlined" sx={{ marginRight: '8px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                            <IconButton onClick={() => this.handleCreateMotivation()} sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        <div style={{ display: 'flex', flexGrow: '1', padding: '8px 8px 0px 16px', marginBottom: '8px', maxHeight: '392px' }}>
                                            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                                <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                    <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                        <TableCell sx={{ width: '100%' }} align="left">Nom de motivation</TableCell>
                                                        <TableCell sx={{ width: '100%' }} align="right">Supprimer</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                    {
                                                        this.state.loadingMotivationsData ? (<div style={{
                                                            width: '100%',
                                                            flexGrow: '1',
                                                            overflow: 'hidden',
                                                            height: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <DotSpinner
                                                                size={40}
                                                                speed={0.9}
                                                                color="black"
                                                            />
                                                        </div>) :
                                                            this.state.motivations.map((row) => (
                                                                <TableRow
                                                                    key={row.id}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell sx={{ width: '100%' }} align="left">{row.content}</TableCell>
                                                                    <TableCell sx={{ width: '100%', padding: '0px 16px 0px 0px' }} align="right">
                                                                        <IconButton onClick={() => {
                                                                            this.setState({ showDeleteMotivationDialog: true, selectedMotivationId: row.id! });
                                                                        }} >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                                <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                                <div style={{ width: '100%', display: 'flex', maxHeight: '450px' }}>
                                    <div style={{ width: '40%', margin: '8px 0px 8px 8px', backgroundColor: 'white', borderRadius: '4px', padding: '16px' }}>
                                        <h4>
                                            Configuration des fournisseurs
                                        </h4>
                                        <div style={{ display: 'flex', margin: '8px 0px' }}>
                                            <TextField value={this.state.supplier.name} onChange={(event) => {
                                                this.state.supplier.name = event.target.value;
                                            }} size="small" id="outlined-basic" label="Nom de fournisseur" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                            <TextField value={this.state.supplier.name} onChange={(event) => {
                                                this.state.supplier.email = event.target.value;
                                            }} type='email' size="small" label="Adresse e-mail" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '8px 0px' }}>
                                            <TextField value={this.state.supplier.phone01} onChange={(event) => {
                                                this.state.supplier.phone01 = event.target.value;
                                            }} size="small" id="outlined-basic" label="Numéro de téléphone 1" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />

                                            <TextField value={this.state.supplier.phone01} onChange={(event) => {
                                                this.state.supplier.phone02 = event.target.value;
                                            }} size="small" label="Numéro de téléphone 2" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '16px 0px' }}>
                                            <FormControl sx={{ width: '50%', marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} size="small">
                                                <InputLabel id="demo-select-small-label">Wilaya</InputLabel>
                                                <Select
                                                    value={this.state.supplier.wilaya}
                                                    onChange={(event) => {
                                                        this.state.supplier.wilaya = event.target.value;
                                                        this.setState({
                                                            selectedWilaya:
                                                                event.target.value.length > 0 ?
                                                                    this.state.wilayas.find((e) => e.name === event.target.value)
                                                                    : undefined
                                                        });
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {
                                                        this.state.wilayas.map((e) => (
                                                            <MenuItem value={e.name}>{e.name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                            <FormControl sx={{ width: '50%', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} size="small">
                                                <InputLabel id="demo-select-small-label">Commune</InputLabel>
                                                <Select
                                                    disabled={!this.state.selectedWilaya}
                                                    value={this.state.supplier.commun}
                                                    onChange={(event) => {
                                                        this.state.supplier.commun = event.target.value;
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {
                                                        this.state.selectedWilaya?.communes?.map((e) => (
                                                            <MenuItem value={e}>{e}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <div style={{ display: 'flex', margin: '16px 0px 0px 0px' }}>
                                            <FormControl sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} size="small">
                                                <InputLabel id="demo-select-small-label">Type</InputLabel>
                                                <Select
                                                    value={this.state.supplier.type ? 1 : 0}
                                                    onChange={(event) => {
                                                        this.state.supplier.type = event.target.value === 1;
                                                        this.setState({ supplier: this.state.supplier });
                                                    }}
                                                >
                                                    <MenuItem value={0}>Pharmacétique</MenuItem>
                                                    <MenuItem value={1}>Parapharmacétique</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Button onClick={() => this.handleCreateSupplier()} startIcon={<AddIcon />} sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                                Ajouter
                                            </Button>
                                        </div>
                                    </div>
                                    <div style={{ width: '60%', display: 'flex', flexGrow: '1', padding: '8px 8px 0px 8px', marginBottom: '8px', maxHeight: '400px' }}>
                                        <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                            <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                    <TableCell sx={{ width: '50%' }} align="left">Nom de fournisseur</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">Wilaya et commune</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">Type</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="right">Supprimer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                {
                                                    this.state.loadingSuppliersData ? (<div style={{
                                                        width: '100%',
                                                        flexGrow: '1',
                                                        overflow: 'hidden',
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <DotSpinner
                                                            size={40}
                                                            speed={0.9}
                                                            color="black"
                                                        />
                                                    </div>) :
                                                        this.state.suppliers.map((row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.name}</TableCell>
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.wilaya + ', ' + row.commun}</TableCell>
                                                                <TableCell sx={{ width: '50%' }} align="left">{row.type ? 'Pharmacétique' : 'Parapharmacétique'}</TableCell>
                                                                <TableCell sx={{ padding: '0px 16px 0px 0px' }} align="right">
                                                                    <IconButton onClick={() => {
                                                                        this.setState({ showDeleteSupplierDialog: true, selectedSupplierId: row.id! });
                                                                    }} >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                                <div style={{ width: '100%', display: 'flex', maxHeight: '450px' }}>
                                    <div style={{ width: '40%', margin: '8px 0px 8px 8px', backgroundColor: 'white', borderRadius: '4px', padding: '16px' }}>
                                        <h4>
                                            Configuration des produits
                                        </h4>
                                        <div style={{ display: 'flex', margin: '8px 0px' }}>
                                            <TextField value={this.state.product.name} onChange={(event) => {
                                                this.state.product.name = event.target.value;
                                            }} size="small" id="outlined-basic" label="Nom de produit" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                            <TextField value={this.state.product.ug} onChange={(event) => {
                                                this.state.product.ug = Number(event.target.value) ?? 0.0;
                                            }} type='number' size="small" label="UG" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '8px 0px' }}>
                                            <TextField value={this.state.product.remise} onChange={(event) => {
                                                this.state.product.remise = Number(event.target.value) ?? 0.0;
                                            }} type='number' size="small" id="outlined-basic" label="Remise" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />

                                            <TextField value={this.state.product.wholesalePriceUnit} onChange={(event) => {
                                                this.state.product.wholesalePriceUnit = Number(event.target.value) ?? 0;
                                            }}
                                                InputProps={{
                                                    inputComponent: NumericFormatCustom as any,
                                                }}
                                                size="small" label="Grossiste prix unitaire" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '8px 0px' }}>
                                            <TextField value={this.state.product.pharmacyPriceUnit} onChange={(event) => {
                                                this.state.product.pharmacyPriceUnit = Number(event.target.value) ?? 0;
                                            }}
                                                InputProps={{
                                                    inputComponent: NumericFormatCustom as any,
                                                }}
                                                size="small" id="outlined-basic" label="Pharmacie prix unitaire" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />

                                            <TextField value={this.state.product.superWholesalePriceUnit} onChange={(event) => {
                                                this.state.product.superWholesalePriceUnit = Number(event.target.value) ?? 0;
                                            }}
                                                InputProps={{
                                                    inputComponent: NumericFormatCustom as any,
                                                }}
                                                size="small" label="Super grossiste prix unitaire" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '8px 0px 0px' }}>
                                            <TextField value={this.state.product.collision} onChange={(event) => {
                                                this.state.product.collision = Number(event.target.value) ?? 0;
                                            }} type='number' size="small" id="outlined-basic" label="Collisage" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                            <TextField value={this.state.product.collision} onChange={(event) => {
                                                this.state.product.ppa = Number(event.target.value) ?? 0.0;
                                            }}
                                                InputProps={{
                                                    inputComponent: NumericFormatCustom as any,
                                                }}
                                                size="small" id="outlined-basic" label="PPA" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '16px 0px 16px 0px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker value={this.state.product.ddp} onChange={(date) => {
                                                    this.state.product.ddp = new Date(date!.toString());
                                                }} label="DDP" />
                                            </LocalizationProvider>
                                            <Button onClick={() => this.handleCreateProduct()} startIcon={<AddIcon />} sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', marginLeft: '16px' }}>
                                                Ajouter
                                            </Button>
                                        </div>
                                    </div>
                                    <div style={{ width: '60%', display: 'flex', flexGrow: '1', padding: '8px 8px 0px 8px', marginBottom: '8px', maxHeight: '400px' }}>
                                        <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                            <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                    <TableCell sx={{ width: '50%' }} align="left">Nom de fournisseur</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left"> UG </TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">Prix grossiste</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="right">Supprimer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                {
                                                    this.state.loadingProductsData ? (<div style={{
                                                        width: '100%',
                                                        flexGrow: '1',
                                                        overflow: 'hidden',
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <DotSpinner
                                                            size={40}
                                                            speed={0.9}
                                                            color="black"
                                                        />
                                                    </div>) :
                                                        this.state.products.map((row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.name}</TableCell>
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.ug}</TableCell>
                                                                <TableCell sx={{ width: '50%' }} align="left">{row.wholesalePriceUnit}</TableCell>
                                                                <TableCell sx={{ padding: '0px 16px 0px 0px' }} align="right">
                                                                    <IconButton onClick={() => {
                                                                        this.setState({ showDeleteProductDialog: true, selectedProductId: row.id! });
                                                                    }} >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                                <div style={{ width: '100%', display: 'flex', maxHeight: '450px' }}>
                                    <div style={{ width: '40%', margin: '8px 0px 8px 8px', backgroundColor: 'white', borderRadius: '4px', padding: '16px' }}>
                                        <h4>
                                            Configuration des produits concurrents
                                        </h4>
                                        <div style={{ display: 'flex', margin: '8px 0px' }}>
                                            <TextField value={this.state.coproduct.name} onChange={(event) => {
                                                this.state.coproduct.name = event.target.value;
                                            }} size="small" id="outlined-basic" label="Nom de produit" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                            <TextField value={this.state.coproduct.ug} onChange={(event) => {
                                                this.state.coproduct.ug = parseInt(event.target.value);
                                            }} type='number' size="small" label="UG" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '8px 0px' }}>
                                            <TextField value={this.state.coproduct.remise} onChange={(event) => {
                                                this.state.coproduct.remise = parseInt(event.target.value);
                                            }} type='number' size="small" id="outlined-basic" label="Remise" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />

                                            <TextField value={this.state.coproduct.wholesalePriceUnit} onChange={(event) => {
                                                this.state.coproduct.wholesalePriceUnit = Number(event.target.value) ?? 0.0;
                                            }}
                                                InputProps={{
                                                    inputComponent: NumericFormatCustom as any,
                                                }}
                                                size="small" label="Grossiste prix unitaire" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '8px 0px' }}>
                                            <TextField value={this.state.coproduct.pharmacyPriceUnit} onChange={(event) => {
                                                this.state.coproduct.pharmacyPriceUnit = Number(event.target.value) ?? 0.0;
                                            }}
                                                InputProps={{
                                                    inputComponent: NumericFormatCustom as any,
                                                }} size="small" id="outlined-basic" label="Pharmacie prix unitaire" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />

                                            <TextField value={this.state.coproduct.superWholesalePriceUnit} onChange={(event) => {
                                                this.state.coproduct.superWholesalePriceUnit = Number(event.target.value) ?? 0.0;
                                            }}
                                                InputProps={{
                                                    inputComponent: NumericFormatCustom as any,
                                                }} size="small" label="Super grossiste prix unitaire" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                        </div>
                                        <div style={{ display: 'flex', margin: '8px 0px 0px' }}>
                                            <TextField value={this.state.coproduct.collision} onChange={(event) => {
                                                this.state.coproduct.collision = parseInt(event.target.value);
                                            }} type='number' size="small" id="outlined-basic" label="Collisage" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />


                                        </div>
                                        <div style={{ display: 'flex', margin: '16px 0px 16px 0px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker value={this.state.coproduct.ddp} onChange={(date) => {
                                                    this.state.coproduct.ddp = date;
                                                }} label="DDP" />
                                            </LocalizationProvider>
                                            <Button onClick={() => this.handleCreateCoProduct()} startIcon={<AddIcon />} sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', marginLeft: '16px' }}>
                                                Ajouter
                                            </Button>
                                        </div>
                                    </div>
                                    <div style={{ width: '60%', display: 'flex', flexGrow: '1', padding: '8px 8px 0px 8px', marginBottom: '8px', maxHeight: '400px' }}>
                                        <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                            <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                    <TableCell sx={{ width: '50%' }} align="left">Nom de fournisseur</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">
                                                        UG
                                                    </TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">Prix grossiste</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="right">Supprimer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                {
                                                    this.state.loadingCoProductsData ? (<div style={{
                                                        width: '100%',
                                                        flexGrow: '1',
                                                        overflow: 'hidden',
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <DotSpinner
                                                            size={40}
                                                            speed={0.9}
                                                            color="black"
                                                        />
                                                    </div>) :
                                                        this.state.coproducts.map((row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.name}</TableCell>
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.ug}</TableCell>
                                                                <TableCell sx={{ width: '50%' }} align="left">{row.wholesalePriceUnit}</TableCell>
                                                                <TableCell sx={{ padding: '0px 16px 0px 0px' }} align="right">
                                                                    <IconButton onClick={() => {
                                                                        this.setState({ showDeleteCoProductDialog: true, selectedCoProductId: row.id! });
                                                                    }} >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                {
                                    this.state.currentUser
                                        .type === UserType.admin ? (
                                        <div>
                                            <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                                            <div style={{ width: '100%', maxHeight: '450px' }}>
                                                <div style={{ margin: '8px', backgroundColor: 'white', borderRadius: '4px', padding: '16px' }}>
                                                    <h4>
                                                        Configuration des chiffres d'affaires
                                                    </h4>
                                                    <div style={{ display: 'flex', marginTop: '8px' }}>
                                                        <TextField value={this.state.expensesConfig.nightPrice} onChange={(event) => {
                                                            this.state.expensesConfig.nightPrice = Number(event.target.value) ?? 0.0;
                                                            this.setState({ expensesConfig: this.state.expensesConfig });
                                                        }}
                                                            InputProps={{
                                                                inputComponent: NumericFormatCustom as any,
                                                            }}
                                                            size="small" id="outlined-basic" label="Prix de nuit" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                                        <TextField value={this.state.expensesConfig.kmPrice} onChange={(event) => {
                                                            this.state.expensesConfig.kmPrice = Number(event.target.value) ?? 0.0;
                                                            this.setState({ expensesConfig: this.state.expensesConfig });
                                                        }}
                                                            InputProps={{
                                                                inputComponent: NumericFormatCustom as any,
                                                            }}
                                                            size="small" id="outlined-basic" label="km Prix" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                                        <Button onClick={() => this.handleSaveExpenseConfigChange()} startIcon={<SaveIcon />} sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                                            enregistrer les modifications
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                }
                                <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                                <div style={{ width: '100%', display: 'flex', flexGrow: '1', flexDirection: 'column', padding: '8px 0px 0px 8px', marginBottom: '8px', maxHeight: '400px' }}>
                                    <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                        <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                            <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                <TableCell sx={{ width: '25%' }} align="left">Délégué</TableCell>
                                                <TableCell sx={{ width: '55%' }} align="left">Objectifs de ventes</TableCell>
                                                <TableCell sx={{ width: '55%' }} align="left">Objectifs de visites</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                            {
                                                this.state.loadingSuppliersData ? (<div style={{
                                                    width: '100%',
                                                    flexGrow: '1',
                                                    overflow: 'hidden',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                    <DotSpinner
                                                        size={40}
                                                        speed={0.9}
                                                        color="black"
                                                    />
                                                </div>) :
                                                    this.state.goals.map((row) => (
                                                        <TableRow
                                                            key={row.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell sx={{ width: '25%' }} align="left">{row.user?.username}</TableCell>
                                                            <TableCell sx={{ width: '55%' }} align="left">
                                                                <TextField value={row.totalSales} onChange={(event) => {
                                                                    row.totalSales = parseInt(event.target.value);
                                                                    this.setState({});
                                                                }} type="number" size="small" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                                            </TableCell>
                                                            <TableCell sx={{ width: '55%' }} align="left">
                                                                <TextField value={row.totalVisits} onChange={(event) => {
                                                                    row.totalVisits = parseInt(event.target.value);
                                                                    this.setState({});
                                                                }}
                                                                    name="numberformat"
                                                                    id="formatted-numberformat-input"
                                                                    type="number"
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                                            </TableCell>


                                                        </TableRow>
                                                    ))}
                                        </TableBody>
                                    </Table>
                                    <Button startIcon={<SaveIcon />} onClick={() => this.handleSaveGoalsChange()} sx={{ width: '350px', border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', margin: '8px' }}>
                                        enregistrer les modifications
                                    </Button>
                                </div>
                                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={this.handleCloseSanckbar} open={this.state.showSnackbar} autoHideDuration={3000} message={this.state.snackbarMessage} />
                                <YesNoDialog onNo={() => {
                                    this.setState({ showDeleteSpecialityDialog: false });
                                }} onYes={() => this.handleRemoveSpeciality()} isOpen={this.state.showDeleteSpecialityDialog} onClose={() => {
                                    this.setState({ showDeleteSpecialityDialog: false });
                                }} message='Voulez-vous supprimer cette spécialité?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showDeleteCommentDialog: false });
                                }} onYes={() => this.handleRemoveComment()} isOpen={this.state.showDeleteCommentDialog} onClose={() => {
                                    this.setState({ showDeleteCommentDialog: false });
                                }} message='Voulez-vous supprimer ce commentaire?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showDeleteMotivationDialog: false });
                                }} onYes={() => this.handleRemoveMotivation()} isOpen={this.state.showDeleteMotivationDialog} onClose={() => {
                                    this.setState({ showDeleteMotivationDialog: false });
                                }} message='Voulez-vous supprimer cette motivation?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showDeleteSupplierDialog: false });
                                }} onYes={() => this.handleRemoveSupplier()} isOpen={this.state.showDeleteSupplierDialog} onClose={() => {
                                    this.setState({ showDeleteSupplierDialog: false });
                                }} message='Voulez-vous supprimer cette fournisseur?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showDeleteProductDialog: false });
                                }} onYes={() => this.handleRemoveProduct()} isOpen={this.state.showDeleteProductDialog} onClose={() => {
                                    this.setState({ showDeleteProductDialog: false });
                                }} message='Voulez-vous supprimer ce produit?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showDeleteCoProductDialog: false });
                                }} onYes={() => this.handleRemoveCoProduct()} isOpen={this.state.showDeleteCoProductDialog} onClose={() => {
                                    this.setState({ showDeleteCoProductDialog: false });
                                }} message='Voulez-vous supprimer  ce produit concurrent?'></YesNoDialog>

                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)', }} value={this.state.index} index={1} >
                            <div className='config-container'>
                                <div style={{ display: 'flex', width: '100%', maxHeight: '450px', marginTop: '8px' }}>
                                    <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', flexGrow: '1', padding: '8px 8px 0px 16px', marginBottom: '8px', maxHeight: '392px' }}>
                                            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                                <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                    <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                        <TableCell sx={{ width: '100%' }} align="left">Nom de spécialité </TableCell>
                                                        <TableCell sx={{ width: '100%' }} align="right">Restaurer</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                    {
                                                        this.state.loadingSpecialitiesData ? (<div style={{
                                                            width: '100%',
                                                            flexGrow: '1',
                                                            overflow: 'hidden',
                                                            height: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <DotSpinner
                                                                size={40}
                                                                speed={0.9}
                                                                color="black"
                                                            />
                                                        </div>) :
                                                            this.state.draftedMedicalSpecialities.map((row) => (
                                                                <TableRow
                                                                    key={row.id}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell sx={{ width: '100%' }} align="left">{row.name}</TableCell>
                                                                    <TableCell sx={{ width: '100%', padding: '0px 16px 0px 0px' }} align="right">
                                                                        <IconButton onClick={() => {
                                                                            this.setState({ showRestoreSpecialityDialog: true, selectedSpecialityId: row.id! });
                                                                        }} >
                                                                            <RestoreIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                </TableBody>
                                            </Table>

                                        </div>
                                    </div>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid grey 1px' }} />
                                    <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>

                                        <div style={{ display: 'flex', flexGrow: '1', padding: '8px 8px 0px 16px', marginBottom: '8px', maxHeight: '392px' }}>
                                            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                                <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                    <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                        <TableCell sx={{ width: '100%' }} align="left">Contenu du commentaire</TableCell>
                                                        <TableCell sx={{ width: '100%' }} align="right">Restaurer</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                    {
                                                        this.state.loadingCommentsData ? (<div style={{
                                                            width: '100%',
                                                            flexGrow: '1',
                                                            overflow: 'hidden',
                                                            height: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <DotSpinner
                                                                size={40}
                                                                speed={0.9}
                                                                color="black"
                                                            />
                                                        </div>) :
                                                            this.state.draftedComments.map((row) => (
                                                                <TableRow
                                                                    key={row.id}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell sx={{ width: '100%' }} align="left">{row.comment}</TableCell>
                                                                    <TableCell sx={{ width: '100%', padding: '0px 16px 0px 0px' }} align="right">
                                                                        <IconButton onClick={() => {
                                                                            this.setState({ showRestoreCommentDialog: true, selectedCommentId: row.id! });
                                                                        }}>
                                                                            <RestoreIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid grey 1px' }} />
                                    <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>

                                        <div style={{ display: 'flex', flexGrow: '1', padding: '8px 8px 0px 16px', marginBottom: '8px', maxHeight: '392px' }}>
                                            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                                <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                    <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                        <TableCell sx={{ width: '100%' }} align="left">Nom de motivation</TableCell>
                                                        <TableCell sx={{ width: '100%' }} align="right">Restaurer</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                    {
                                                        this.state.loadingMotivationsData ? (<div style={{
                                                            width: '100%',
                                                            flexGrow: '1',
                                                            overflow: 'hidden',
                                                            height: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <DotSpinner
                                                                size={40}
                                                                speed={0.9}
                                                                color="black"
                                                            />
                                                        </div>) :
                                                            this.state.draftedMotivations.map((row) => (
                                                                <TableRow
                                                                    key={row.id}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell sx={{ width: '100%' }} align="left">{row.content}</TableCell>
                                                                    <TableCell sx={{ width: '100%', padding: '0px 16px 0px 0px' }} align="right">
                                                                        <IconButton onClick={() => {
                                                                            this.setState({ showRestoreMotivationDialog: true, selectedMotivationId: row.id! });
                                                                        }} >
                                                                            <RestoreIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                                <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                                <div style={{ width: '100%', display: 'flex', maxHeight: '450px' }}>

                                    <div style={{ width: '60%', display: 'flex', flexGrow: '1', padding: '8px 8px 0px 8px', marginBottom: '8px', maxHeight: '400px' }}>
                                        <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                            <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                    <TableCell sx={{ width: '50%' }} align="left">Nom de fournisseur</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">Wilaya et commune</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">Type</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="right">Restaurer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                {
                                                    this.state.loadingSuppliersData ? (<div style={{
                                                        width: '100%',
                                                        flexGrow: '1',
                                                        overflow: 'hidden',
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <DotSpinner
                                                            size={40}
                                                            speed={0.9}
                                                            color="black"
                                                        />
                                                    </div>) :
                                                        this.state.draftedSuppliers.map((row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.name}</TableCell>
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.wilaya + ', ' + row.commun}</TableCell>
                                                                <TableCell sx={{ width: '50%' }} align="left">{row.type ? 'Pharmacétique' : 'Parapharmacétique'}</TableCell>
                                                                <TableCell sx={{ padding: '0px 16px 0px 0px' }} align="right">
                                                                    <IconButton onClick={() => {
                                                                        this.setState({ showRestoreSupplierDialog: true, selectedSupplierId: row.id! });
                                                                    }} >
                                                                        <RestoreIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                                <div style={{ width: '100%', display: 'flex', maxHeight: '450px', flexDirection: 'column', }}>
                                    <h4 style={{ marginLeft: '16px' }}>
                                        Produits
                                    </h4>
                                    <div style={{ display: 'flex', flexGrow: '1', padding: '0px 8px', marginBottom: '8px', maxHeight: '400px', width: '100%', }}>
                                        <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                            <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                    <TableCell sx={{ width: '50%' }} align="left">Nom de fournisseur</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">
                                                        UG
                                                    </TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">Prix grossiste</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="right">Restaurer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                {
                                                    this.state.loadingProductsData ? (<div style={{
                                                        width: '100%',
                                                        flexGrow: '1',
                                                        overflow: 'hidden',
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <DotSpinner
                                                            size={40}
                                                            speed={0.9}
                                                            color="black"
                                                        />
                                                    </div>) :
                                                        this.state.draftedProducts.map((row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.name}</TableCell>
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.ug}</TableCell>
                                                                <TableCell sx={{ width: '50%' }} align="left">{row.wholesalePriceUnit}</TableCell>
                                                                <TableCell sx={{ padding: '0px 16px 0px 0px' }} align="right">
                                                                    <IconButton onClick={() => {
                                                                        this.setState({ showRestoreProductDialog: true, selectedProductId: row.id! });
                                                                    }} >
                                                                        <RestoreIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                                <div style={{ width: '100%', display: 'flex', maxHeight: '450px', flexDirection: 'column' }}>
                                    <h4 style={{ marginLeft: '16px' }}>
                                        Produits concurrent
                                    </h4>
                                    <div style={{ display: 'flex', flexGrow: '1', padding: '0px 8px', marginBottom: '8px', maxHeight: '400px', width: '100%', }}>
                                        <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%", borderRadius: '4px', }} aria-label="simple table">
                                            <TableHead sx={{ height: '45px', display: 'flex', width: '100%' }}>
                                                <TableRow sx={{ display: 'flex', width: '100%' }}>
                                                    <TableCell sx={{ width: '50%' }} align="left">Nom de fournisseur</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">  UG </TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="left">Prix grossiste</TableCell>
                                                    <TableCell sx={{ width: '50%' }} align="right">Restaurer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                                                {
                                                    this.state.loadingCoProductsData ? (<div style={{
                                                        width: '100%',
                                                        flexGrow: '1',
                                                        overflow: 'hidden',
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <DotSpinner
                                                            size={40}
                                                            speed={0.9}
                                                            color="black"
                                                        />
                                                    </div>) :
                                                        this.state.draftedCoProducts.map((row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.name}</TableCell>
                                                                <TableCell sx={{ width: '32%' }} align="left">{row.ug}</TableCell>
                                                                <TableCell sx={{ width: '50%' }} align="left">{row.wholesalePriceUnit}</TableCell>
                                                                <TableCell sx={{ padding: '0px 16px 0px 0px' }} align="right">
                                                                    <IconButton onClick={() => {
                                                                        this.setState({ showRestoreCoProductDialog: true, selectedCoProductId: row.id! });
                                                                    }} >
                                                                        <RestoreIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={this.handleCloseSanckbar} open={this.state.showSnackbar} autoHideDuration={3000} message={this.state.snackbarMessage} />
                                <YesNoDialog onNo={() => {
                                    this.setState({ showRestoreSpecialityDialog: false });
                                }} onYes={() => this.handleRestoreSpeciality()} isOpen={this.state.showRestoreSpecialityDialog} onClose={() => {
                                    this.setState({ showRestoreSpecialityDialog: false });
                                }} message='Voulez-vous restaurer cette spécialité?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showRestoreCommentDialog: false });
                                }} onYes={() => this.handleRestoreComment()} isOpen={this.state.showRestoreCommentDialog} onClose={() => {
                                    this.setState({ showRestoreCommentDialog: false });
                                }} message='Voulez-vous restaurer ce commentaire?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showRestoreMotivationDialog: false });
                                }} onYes={() => this.handleRestoreMotivation()} isOpen={this.state.showRestoreMotivationDialog} onClose={() => {
                                    this.setState({ showRestoreMotivationDialog: false });
                                }} message='Voulez-vous restaurer cette motivation?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showRestoreSupplierDialog: false });
                                }} onYes={() => this.handleRestoreSupplier()} isOpen={this.state.showRestoreSupplierDialog} onClose={() => {
                                    this.setState({ showRestoreSupplierDialog: false });
                                }} message='Voulez-vous restaurer cette fournisseur?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showRestoreProductDialog: false });
                                }} onYes={() => this.handleRestoreProduct()} isOpen={this.state.showRestoreProductDialog} onClose={() => {
                                    this.setState({ showRestoreProductDialog: false });
                                }} message='Voulez-vous restaurer ce produit?'></YesNoDialog>
                                <YesNoDialog onNo={() => {
                                    this.setState({ showRestoreCoProductDialog: false });
                                }} onYes={() => this.handleRestoreCoProduct()} isOpen={this.state.showRestoreCoProductDialog} onClose={() => {
                                    this.setState({ showRestoreCoProductDialog: false });
                                }} message='Voulez-vous restaurer ce produit concurrent?'></YesNoDialog>
                            </div>
                        </CustomTabPanel>
                    </Box>
                </div>

            );
        }
    }
}

export default ConfigPage;