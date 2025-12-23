@echo off
echo ===== DESATIVANDO HYPER-V E SERVIÇOS RELACIONADOS =====

:: Desinstalar recursos do Hyper-V
dism /online /disable-feature /featurename:Microsoft-Hyper-V-All /norestart
dism /online /disable-feature /featurename:Microsoft-Hyper-V /norestart
dism /online /disable-feature /featurename:Microsoft-Hyper-V-Management-Clients /norestart
dism /online /disable-feature /featurename:Microsoft-Hyper-V-Hypervisor /norestart
dism /online /disable-feature /featurename:Microsoft-Hyper-V-Services /norestart
dism /online /disable-feature /featurename:VirtualMachinePlatform /norestart
dism /online /disable-feature /featurename:Windows-Hypervisor-Platform /norestart
dism /online /disable-feature /featurename:HypervisorPlatform /norestart
dism /online /disable-feature /featurename:Containers /norestart

:: Desabilitar Device Guard e Credential Guard
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /f
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\LSA\LsaCfgFlags" /f

:: Desabilitar o lançamento do hypervisor no boot
bcdedit /set hypervisorlaunchtype off

:: Desabilitar Memory Integrity se estiver ativada (requer reboot manual depois)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v Enabled /t REG_DWORD /d 0 /f

:: Aviso
echo.
echo REINICIE O COMPUTADOR PARA AS MUDANÇAS TEREM EFEITO!
pause