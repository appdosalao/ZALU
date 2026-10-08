param([string]$Target="prod")
$denied=@("EXTERMINIO_ERRO_OWNER_ID.sql","RESTAURACAO_USER_ID","SQL_DEFINITIVO_UNIFICADO","SOLUCAO_FINAL_AGENDAMENTO","fix_rls","FIX_VISIBILIDADE_HORARIOS","fix_online_booking")
$hits=Get-ChildItem -Filter *.sql -Recurse | Where-Object { $n=$_.Name; $denied | Where-Object { $n -like "*$_*" } } | Select-Object -ExpandProperty FullName
if($hits -and $Target -eq "prod"){
  Write-Error "BLOQUEADO: SQL legado perigoso detectado. Não aplicar em prod:`n$($hits -join "`n")`nUse docs/SQL_CONSOLIDATION.md"
  exit 1
}
Write-Host "OK: nenhum SQL legado será aplicado em $Target"
