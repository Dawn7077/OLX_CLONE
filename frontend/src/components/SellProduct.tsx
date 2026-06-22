import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import {  useNavigate,Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createProduct } from "../features/productSlice";
import Navbar from "../components/Navbar";


interface SellFormInput{
    title:string
    description: string;
    price: number;
    category: string;
    imageUrl: FileList;
}

export default function SellProduct(){
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const {isLoading,isError,message} = useSelector((state:RootState)=>state.products)

    const {register,handleSubmit,watch,formState:{errors}} = useForm<SellFormInput>()
    
    const watchImg = watch('imageUrl')
    const previewUrl = watchImg && watchImg[0] ?URL.createObjectURL(watchImg[0]):null

    const onSubmit = async(data:SellFormInput)=>{
        const formData = new FormData()
        formData.append('title',data.title)
        formData.append('description',data.description)
        formData.append('price',data.price.toString())
        formData.append('category',data.category)

        if(data.imageUrl && data.imageUrl[0]){
            formData.append('image',data.imageUrl[0])
        }
        
        
       
        const result = await dispatch(createProduct(formData));
        //  Argument of type 'FormData' is not assignable to parameter of type 'CreateProductInput'.
        //   Type 'FormData' is missing the following properties from type 'CreateProductInput': title, description, price, imageUrlts(2345)
        //   const formData: FormData

        if(createProduct.fulfilled.match(result)){
            navigate('/')
        }

    }


    return(
      <div style={styles.pageWrapper}>
            <Navbar />
            
            <div style={styles.cardContainer}>
                {/* Heading Row */}
                <div style={styles.headerRow}>
                    <h2 style={styles.formTitle}>Post Your Product</h2>
                    <Link to="/" style={styles.backLink}>
                        ← Home
                    </Link>
                </div>
                
                {isError && <div style={styles.errorBanner}>{message}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Title Input */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Item Title</label>
                        <input 
                            type="text"
                            placeholder="e.g. iPhone 14 Pro Max"
                            style={styles.inputField}
                            {...register('title', { required: 'Title is required' })}
                        /> 
                        {errors.title && <span style={styles.fieldError}>{errors.title.message}</span>}
                    </div>

                    {/* Price Input */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Price (₹)</label>
                        <input 
                            type="number"
                            placeholder="Enter amount"
                            style={styles.inputField}
                            {...register('price', { 
                                required: 'Price is required',
                                min: { value: 1, message: 'Price must be greater than 0' }
                            })}
                        />
                        {errors.price && <span style={styles.fieldError}>{errors.price.message}</span>}
                    </div>

                    {/* Category Selection */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Category</label>
                        <select style={styles.selectField} {...register('category', { required: 'Select a category' })}>
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="Fashion">Fashion</option>
                        </select>
                        {errors.category && <span style={styles.fieldError}>{errors.category.message}</span>}
                    </div>

                    {/* Styled Image Upload Wrapper */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Product Image</label>
                        <div style={styles.uploadBox}>
                            <input
                                type="file"
                                accept="image/*"
                                style={styles.fileInputHidden}
                                id="file-upload"
                                {...register('imageUrl', { required: 'Image file is required' })}
                            />
                            <label htmlFor="file-upload" style={styles.uploadLabelBtn}>
                                📸 Choose Photo
                            </label>
                            
                            {previewUrl && (
                                <div style={styles.previewContainer}>
                                    <img src={previewUrl} alt="Preview" style={styles.imagePreview} />   
                                </div>
                            )}
                        </div>
                        {errors.imageUrl && <span style={styles.fieldError}>{errors.imageUrl.message}</span>}
                    </div>

                    {/* Description Textarea */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            placeholder="Include condition, features, age, etc."
                            style={styles.textareaField}
                            {...register('description', {
                                required: 'Description is required',
                                minLength: { value: 10, message: 'Must be at least 10 characters' }
                            })}
                        />
                        {errors.description && <span style={styles.fieldError}>{errors.description.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={isLoading} style={styles.submitBtn}>
                        {isLoading ? 'Posting Ad...' : 'Post Now'}
                    </button>
                </form>
            </div>
        </div>
    
    )


}
const styles = {
    pageWrapper: {
        backgroundColor: '#f2f4f5',
        minHeight: '100vh',
        fontFamily: 'Roboto, Arial, sans-serif'
    },
    cardContainer: {
        maxWidth: '550px',
        margin: '3rem auto',
        padding: '2.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e3e7eb'
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid #e3e7eb',
        paddingBottom: '1rem'
    },
    formTitle: {
        margin: 0,
        color: '#002f34',
        fontSize: '1.6rem',
        fontWeight: 700
    },
    backLink: {
        color: '#002f34',
        fontWeight: 'bold',
        textDecoration: 'none',
        fontSize: '0.95rem',
        transition: 'opacity 0.2s'
    },
    inputGroup: {
        marginBottom: '1.5rem'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: 600,
        fontSize: '0.9rem',
        color: '#002f34'
    },
    inputField: {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #002f34',
        boxSizing: 'border-box' as const,
        fontSize: '1rem',
        color: '#002f34',
        backgroundColor: '#fff',
        outline: 'none'
    },
    selectField: {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #002f34',
        boxSizing: 'border-box' as const,
        fontSize: '1rem',
        color: '#002f34',
        backgroundColor: '#fff',
        outline: 'none'
    },
    textareaField: {
        width: '100%',
        padding: '0.75rem',
        height: '110px',
        borderRadius: '4px',
        border: '1px solid #002f34',
        boxSizing: 'border-box' as const,
        fontSize: '1rem',
        color: '#002f34',
        fontFamily: 'inherit',
        resize: 'none' as const,
        backgroundColor: '#fff',
        outline: 'none'
    },
    uploadBox: {
        border: '2px dashed #ccd5d6',
        borderRadius: '6px',
        padding: '1.5rem',
        textAlign: 'center' as const,
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '1rem'
    },
    fileInputHidden: {
        display: 'none'
    },
    uploadLabelBtn: {
        backgroundColor: '#fff',
        color: '#002f34',
        border: '2px solid #002f34',
        padding: '0.5rem 1.2rem',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s'
    },
    previewContainer: {
        position: 'relative' as const
    },
    imagePreview: {
        width: '120px',
        height: '120px',
        objectFit: 'cover' as const,
        borderRadius: '4px',
        border: '1px solid #ccd5d6',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    submitBtn: {
        width: '100%',
        padding: '0.85rem',
        backgroundColor: '#002f34',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1.05rem',
        fontWeight: 'bold' as const,
        cursor: 'pointer',
        marginTop: '1rem',
        transition: 'background-color 0.2s'
    },
    fieldError: {
        color: '#ff4d4f',
        fontSize: '0.8rem',
        marginTop: '0.35rem',
        display: 'block'
    },
    errorBanner: {
        backgroundColor: '#fff1f0',
        color: '#ff4d4f',
        border: '1px solid #ffccc7',
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1.5rem',
        fontSize: '0.9rem'
    }
};