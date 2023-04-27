import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

class GetProjectDto {
  // @ApiProperty({
  //   type: Number,
  //   example: 1,
  // })
  // @Type(() => Number)
  // @IsNumber()
  // page: number

  // @ApiProperty({
  //   type: Number,
  //   example: 1,
  // })
  // @Type(() => Number)
  // @IsNumber()
  // ProjectKey: number;

  // @ApiProperty({
  //   type: String,
  // })
  // @Type(() => String)
  // @IsString()
  // Code: string;

  @ApiProperty({
    type: Date,
  })
  @Type(() => Date)
  @IsString()
  StartDT: Date;

  // Code                   String @unique(map: "Code_UNIQUE") @db.String(20)
  // Name                   String @db.String
  // StartDT                DateTime ?              @db.Timestamp(0)
  // EndDT                  DateTime ?              @db.Timestamp(0)
  // Note                   String ?                @db.String
  // ProjectSKey            Int
  // ContractCode           String ?                @db.String(40)
  // ContractDate           DateTime ?              @db.Timestamp(0)
  // ContractorKey          Int ?
  // ContractorName         String ?                @db.String(100)
  // IsExternalProject      Int @db.Int2
  // DepartmentKey          BigInt ?
  // OwnerKey               Int ?
  //   OwnerName              String ?                @db.String(100)
  // DesignerNote           String ?                @db.String
  // TotalBudget            Decimal ?               @db.Decimal(19, 2)
  // FineAmount             Decimal ?               @db.Decimal(19, 2)
  // ProgressNote           String ?                @db.String
  // RecorderKey            Int
  // RecordDT               DateTime @db.Timestamp(0)
  // CompleteEmpKey         Int ?
  // CompleteDT             DateTime ?              @db.Timestamp(0)
  // CompleteNote           String ?                @db.String
  // CancelEmpKey           Int ?
  // CancelDT               DateTime ?              @db.Timestamp(0)
  // CancelNote             String ?                @db.String
  // ProjectTypeKey         Int
  // AddressNote            String ?                @db.String
  // SubdistrictKey         BigInt ?
  // DistrictKey            BigInt ?
  //   ProvinceKey            Int ?
  //     Latitude               Float ?                 @db.Float4
  // Longtitude             Float ?                 @db.Float4
  // ContractPdfFileName    String ?                @db.String
  // DrawingPdfFileName     String ?                @db.String
  // YearKey                BigInt
  // ExternalProjectNote    String ?                @db.String
  // PendingName            String ?                @db.String
  // MainImgFileName        String ?                @db.String
  // OwnerTypeKey           Int @db.Int2
  // AdvanceAmount          Decimal ?               @db.Decimal(19, 2)
  // BOQPdfFileName         String ?                @db.String
  // PhasePdfFileName       String ?                @db.String
  // ProjectEngineerKey     Int ?
  // ProjectEngineerNote    String ?                @db.String
  // ProjectEngineerName    String ?                @db.String
  // ProjectPendingTypeKey  Int ?
  // PercentAdvReim         Decimal ?               @db.Decimal(19, 2)
  // AdvanceAmtBalAftReim   Decimal ?               @db.Decimal(19, 2)
  // PercentDebAdvance      Decimal ?               @db.Decimal(19, 2)
  // RefProjectKey          Int ?
  // InstallmentPdfFileName String ?                @db.String
  // CommitteeRoleTypeKey   Int ?
  // Department             Department ?            @relation(fields: [DepartmentKey], references: [DepartmentKey], onDelete: Restrict, map: "ProjectDepartmentKey")
  // District               District ?              @relation(fields: [DistrictKey], references: [DistrictKey], onDelete: Restrict, map: "ProjectDistrictKey")
  // Subdistrict            Subdistrict ?           @relation(fields: [SubdistrictKey], references: [SubdistrictKey], onDelete: Restrict, map: "ProjectSubdistrictKey")
  // Year                   Year @relation(fields: [YearKey], references: [YearKey], map: "ProjectYearKey")
  // ProjectBlackList       ProjectBlackList[]
  // ProjectBudget          ProjectBudget[]
  // ProjectChecklist       ProjectChecklist[]
  // ProjectCommittee       ProjectCommittee[]
  // ProjectDProgress       ProjectDProgress[]
  // ProjectDeliver         ProjectDeliver[]
  // ProjectExtSupervisor   ProjectExtSupervisor[]
  // ProjectImgLocations    ProjectImgLocations[]
  // ProjectMPlan           ProjectMPlan[]
  // ProjectModification    ProjectModification[]
  // ProjectPhase           ProjectPhase[]
  // ProjectSupervisor      ProjectSupervisor[]
  // ProjectTask            ProjectTask[]
  // ProjectUser            ProjectUser ?
  // ProjectWProgress       ProjectWProgress[]
  // XReqMessage            XReqMessage[]

  // @ApiProperty({
  //   type: Number,
  //   example: 20,
  // })
  // @Type(() => Number)
  // @IsNumber()
  // perPage: number
  // @ApiPropertyOptional({
  //   type: String,
  //   enum: EPaymentMethod,
  // })
  // method?: EPaymentMethod
}

export default GetProjectDto;
