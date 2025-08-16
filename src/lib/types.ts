import * as Yup from 'yup';
export const LoginSchema = Yup.object().shape({
  idNumber: Yup.string()
    .required('يلزم ادخال رقم الهوية')
    .min(10, 'برجاء التأكد من رقم الهوية المدخل')
    .max(10, 'برجاء التأكد من رقم الهوية المدخل'),
});

export type TLoginSchema = Yup.InferType<typeof LoginSchema>;
