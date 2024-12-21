import { ExecutionEnvironment } from '@/types/executor'
import { ExtractDataWithAITask } from '../task/ExtractDataWithAI'
import prisma from '@/lib/prisma'
import { sysmmetricDecrypt } from '@/lib/encryption'

export async function ExtractDataWithAIExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> {
  try {
    const credentialId = environment.getInput('Credentials')
    if (!credentialId) {
      environment.log.error('input->Credentials not defined')
    }

    const prompt = environment.getInput('Prompt')
    if (!prompt) {
      environment.log.error('input->prompt not defined')
    }

    const content = environment.getInput('Content')
    if (!content) {
      environment.log.error('input->content not defined')
    }

    const credential = await prisma.credential.findUnique({
      where: {
        id: credentialId
      }
    })

    if (!credential) {
      environment.log.error('credential not found')
      return false
    }

    const plainCredentialValue = sysmmetricDecrypt(credential.value)
    if (!plainCredentialValue) {
      environment.log.error('cannot decrypt credential value')
      return false
    }

    const mockExtractedData = {
      usernameSelector: '#username',
      passwordSelector: '#password',
      loginSelector: 'body > div > form > input.btn.btn-primary'
    }
    environment.setOutput('Extracted data', JSON.stringify(mockExtractedData))

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
