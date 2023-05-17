import React, { useContext } from 'react'

//components
import Button from '../Button';
import Alert from '../Alert';
import Input from '../Input'

//deeps
import api_client from '../../config/api_client';

//context
import { AppContext } from '@/pages/_app';

//styles
import { BsFillFileEarmarkFill } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function BudgetForm({ organization_id }) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const { current_user } = useContext(AppContext)
  const user_id = current_user?.id 
  const [files, setFiles] = React.useState([]);
  const [is_loaded, setIsLoaded] = React.useState({ is_loaded: true, status: '' });
  const [open_alert, setOpenAlert] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description) {
      return toast.error('Preencha todos os campos')
    }

    setIsLoaded({ is_loaded: false, status: '' })
    setOpenAlert(true)
    await api_client.post('/budgets/', { title, description, organization_id, user_id })
      .then(async ({ data }) => {
        if (files.length === 0) {
          toast.success('Orçamento enviado com sucesso!')
          resetFields()
          return setIsLoaded({ is_loaded: true, status: 'success' })
        }

        for await (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          await api_client.post(`/budgets/${data.id}/upload_files/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        }

        resetFields()
        toast.success('Orçamento enviado com sucesso!')
        return setIsLoaded({ is_loaded: true, status: 'success' })
      })
      .catch(error => {
        console.error(error)
        setIsLoaded({ is_loaded: true, status: 'error' })
        toast.error('Erro ao enviar orçamento')
      })
  }

  function handleSetFiles(e) {
    const file = (e.target.files[0])
    setFiles([...files, file]);
  }

  function resetFields() {
    setTitle('');
    setDescription('');
    setFiles([]);
  }

  return (
    <>
      <div className="flex w-full h-fit items-center flex-col overflow-hidden gap-6 pb-10">
        <form onSubmit={handleSubmit} className='flex flex-col w-[90%] gap-6 sm:px-4 sm:py-8 md:p-8 min-h-[300px] h-full rounded-2xl shadow-xl dark:bg-dark-background-neutral bg-background-neutral'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col'>
              <p className='font-semibold text-2xl'>Título</p>
              <p className='text-typography-light dark:text-dark-typography-light'>
                Defina um título que sirva como um resumo do seu projeto
              </p>
            </div>
            <Input
              value={title}
              onChange={setTitle}
              className='bg-background-optional'
              placeholder='Digite o título de seu projeto aqui...'
            />
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col'>
              <p className='font-semibold text-2xl'>Descreva seu projeto</p>
              <p className='text-typography-light dark:text-dark-typography-light'>
                Nesta seção você deve, sem poupar detalhes, descrever quais as características do serviço que deseja realizar o orçamento
              </p>
            </div>
            <Input
              value={description}
              onChange={setDescription}
              type='textarea'
              rows={5}
              className='bg-background-optional'
              placeholder='Digite o título do projeto que deseja realizar orçamento aqui...'
            />
          </div>
          <div className='h-[2px] w-full bg-typography-light/40 dark:bg-dark-typography-light/40' />
          <div className='flex flex-col gap-4 overflow-hidden'>
            <div className='flex flex-col'>
              <div className='flex gap-1'>
                <p className='font-semibold text-2xl'>Anexar arquivos</p>
              </div>
              <p className='text-typography-light dark:text-dark-typography-light'>
                Nesta seção, você pode incluir fotos ou documentos que complementem sua descrição
              </p>
            </div>
            <div className='overflow-x-auto flex pr-3'>
              <div className='flex gap-2 w-fit'>
                {files.map((file, index) =>
                  <div key={index} className='duration-200 relative cursor-pointer md:w-[144px] group md:h-[144px] sm:w-[80px] sm:h-[80px] rounded-2xl'>
                    {file?.type?.includes('image') ?
                      <Image src={URL.createObjectURL(file)} alt={file.name} className='md:w-[144px] md:h-[144px] sm:w-[80px] sm:h-[80px] object-cover rounded-2xl' />
                      :
                      <div className='md:w-[144px] md:h-[144px] relative sm:w-[80px] sm:h-[80px] flex flex-col overflow-hidden items-center justify-center rounded-2xl bg-background-optional dark:bg-dark-background-light'>
                        <BsFillFileEarmarkFill className='text-typography-light dark:text-dark-typography-light sm:text-3xl md:text-6xl' />
                        <p className='text-typography-light dark:text-dark-typography-light w-full text-center sm:text-[10px] md:text-sm'>{file.name.replace(/(.{10})..+/, "$1..")} .{file?.type?.replace(/.+\/(.+)/, "$1")}</p>
                      </div>
                    }
                    <div className='flex absolute top-0 flex-col items-end justify-start sm:p-1 md:p-2 w-full h-full'>
                      <MdClose title='Excluir Arquivo' onClick={() => setFiles(files.filter((_, i) => i !== index))} className='text-white sm:text-2xl md:text-4xl hover:scale-110 duration-100 cursor-pointer' />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex md:flex-row sm:flex-col items-center sm:gap-2 md:gap-4'>
              <div className='flex relative sm:w-full md:max-w-fit'>
                <input
                  type='file'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  onChange={handleSetFiles}
                />
                <Button type='button' className='whitespace-nowrap sm:w-full md:w-fit px-8 py-4'>
                  Adicionar Documento
                </Button>
              </div>
              {files.length ?
                <p className='font-light text-typography-light dark:text-dark-typography-light sm:text-md md:text-xl'>
                  {files.length} Arquivos Adicionados
                </p>
                : null
              }
            </div>
          </div>
          <div className='h-[2px] w-full bg-typography-light/40 dark:bg-dark-typography-light/40' />
          <Button type='submit' className='whitespace-nowrap sm:w-full md:w-[250px] sm:self-center md:self-end py-4'>
            Enviar
          </Button>
        </form>
      </div>
      <Alert show={open_alert} is_loaded={is_loaded?.is_loaded} response={is_loaded?.status} close={() => setOpenAlert(false)} />
    </>
  )
}
